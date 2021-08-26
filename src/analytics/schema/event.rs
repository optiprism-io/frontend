use chrono::{Date, Utc, DateTime};
use rocksdb::{DB};
use std::rc::Rc;
use datafusion::datasource::TableProvider;
use std::sync::Arc;
use crate::analytics::error::{Error, Result};
use serde::{Serialize, Deserialize};
use datafusion::parquet::data_type::AsBytes;

pub enum EventStatus {
    Enabled,
    Disabled,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Copy, Clone)]
pub struct Event {
    id: u64,
    created_at: DateTime<Utc>,
    updated_at: Option<DateTime<Utc>>,
    created_by: u64,
    updated_by: u64,
    project_id: u64,
    tags: Vec<String>,
    name: String,
    description: String,
    status: EventStatus,
    properties: Option<Vec<u64>>,
}

pub struct Provider {
    db: Arc<DB>,
}

impl Provider {
    fn create_event(&mut self, event: &Event) -> Result<Event> {
        let mut w = event.clone();
        w.created_at = chrono::offset::Utc::now();
        w.id = 0; // get unique id from rocksdb for current event
        let encoded: Vec<u8> = bincode::serialize(&event)?;
        self.db.put(event.user_id.as_bytes(), &encoded)?;

        Ok(w)
    }

    fn update_event(&self, event: &Event) -> Result<Event> {}
    fn get_event_by_id(&self, id: u64) -> Result<Option<Event>> {} // option for not found
    fn get_event_by_name(&self, project_id: u64, name: String) -> Result<Option<Event>> {}
    fn delete_event(&self, id: u64) -> Result<()> {}
    fn enable_event(&self, id: u64) -> Result<()> {}
    fn disable_event(&self, id: u64) -> Result<()> {}
    fn list_events(&self, project_id: u64) -> Result<Option<Vec<Event>>> {}
    fn event_table_provider(&self) -> Arc<dyn TableProvider> {}
}