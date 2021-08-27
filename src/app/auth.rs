use super::{
    account,
    error::{Result, ERR_AUTH_LOG_IN_INVALID_PASSWORD},
    organization,
    rbac::{Role, Scope},
};
use chrono::{Duration, Utc};
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use serde::{Deserialize, Serialize};
use sha3::{Digest, Sha3_256};
use std::{collections::HashMap, env::var, ops::Add, sync::Arc};

lazy_static::lazy_static! {
    static ref COMMON_SALT: String = var("FNP_COMMON_SALT").unwrap();
    static ref EMAIL_TOKEN_KEY: String = var("FNP_EMAIL_TOKEN_KEY").unwrap();
    static ref ACCESS_TOKEN_KEY: String = var("FNP_ACCESS_TOKEN_KEY").unwrap();
    static ref REFRESH_TOKEN_KEY: String = var("FNP_REFRESH_TOKEN_KEY").unwrap();

    static ref ACCESS_TOKEN_DURATION: Duration = Duration::hours(1);
    static ref REFRESH_TOKEN_DURATION: Duration = Duration::days(30);
}

#[derive(Deserialize)]
pub struct LogInRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct SignUpRequest {
    pub organization_name: String,
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
struct RefreshRequest {
    pub refresh_token: String,
}

#[derive(Deserialize)]
struct RecoverRequest {
    pub email: String,
}

#[derive(Serialize)]
pub struct TokensResponse {
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Serialize, Deserialize)]
pub struct AccessClaims {
    pub organization_id: u64,
    pub account_id: u64,
    pub exp: i64,
}

#[derive(Serialize, Deserialize)]
pub struct RefreshClaims {
    pub organization_id: u64,
    pub account_id: u64,
    pub exp: i64,
}

pub struct Provider {
    account_provider: Arc<account::Provider>,
    organization_provider: Arc<organization::Provider>,
}

impl Provider {
    pub fn new(
        account_provider: Arc<account::Provider>,
        organization_provider: Arc<organization::Provider>,
    ) -> Self {
        Self {
            account_provider,
            organization_provider,
        }
    }

    pub async fn sign_up(&self, request: SignUpRequest) -> Result<TokensResponse> {
        let org = self
            .organization_provider
            .create(organization::CreateRequest {
                name: request.organization_name,
            })?;
        let mut roles = HashMap::new();
        roles.insert(Scope::Organization, Role::Owner);
        let acc = self.account_provider.create(account::CreateRequest {
            organization_id: org.id,
            username: request.username,
            password: request.password,
            roles: Some(roles),
            permissions: None,
        })?;
        make_token_response(acc)
    }

    pub fn log_in(&self, request: LogInRequest) -> Result<TokensResponse> {
        let acc = self.account_provider.get_by_email(request.email)?;
        if !is_valid_password(&request.password, &acc.salt, &acc.password) {
            return Err(ERR_AUTH_LOG_IN_INVALID_PASSWORD.into());
        }
        make_token_response(acc)
    }
}

fn make_token_response(acc: account::Account) -> Result<TokensResponse> {
    Ok(TokensResponse {
        access_token: make_token(
            AccessClaims {
                organization_id: acc.organization_id,
                account_id: acc.id,
                exp: Utc::now().add(ACCESS_TOKEN_DURATION.clone()).timestamp(),
            },
            ACCESS_TOKEN_KEY.as_bytes(),
        )?,
        refresh_token: make_token(
            RefreshClaims {
                organization_id: acc.organization_id,
                account_id: acc.id,
                exp: Utc::now().add(REFRESH_TOKEN_DURATION.clone()).timestamp(),
            },
            REFRESH_TOKEN_KEY.as_bytes(),
        )?,
    })
}

fn make_token<T: Serialize>(claims: T, key: &[u8]) -> Result<String> {
    let mut header = jsonwebtoken::Header::default();
    header.alg = jsonwebtoken::Algorithm::HS512;
    Ok(jsonwebtoken::encode(
        &header,
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(key),
    )?)
}

pub fn parse_access_token(value: &str) -> Result<AccessClaims> {
    let token = jsonwebtoken::decode(
        &value,
        &jsonwebtoken::DecodingKey::from_secret(ACCESS_TOKEN_KEY.as_bytes()),
        &jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS512),
    )?;
    Ok(token.claims)
}

pub fn parse_refresh_token(value: &str) -> Result<RefreshClaims> {
    let token = jsonwebtoken::decode(
        &value,
        &jsonwebtoken::DecodingKey::from_secret(REFRESH_TOKEN_KEY.as_bytes()),
        &jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS512),
    )?;
    Ok(token.claims)
}

pub fn is_valid_password(password: &str, salt: &str, password_hash: &str) -> bool {
    password_hash == make_password_hash(password, salt)
}

pub fn make_salt() -> String {
    let rand_part: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(64)
        .map(char::from)
        .collect();
    let mut salt: String = Utc::now().to_rfc3339();
    salt.push_str(&rand_part);
    let mut hasher = Sha3_256::new();
    hasher.update(salt);
    hex::encode(hasher.finalize())
}

pub fn make_password_hash(password: &str, salt: &str) -> String {
    let mut hasher = Sha3_256::new();
    hasher.update(vec![password, salt, &COMMON_SALT].concat());
    hex::encode(hasher.finalize())
}
