<template>
  <h2 class="pf-v5-u-font-size-xl pf-v5-u-font-family-heading-sans-serif">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  </h2>

  <b> sdkToken: {{ sdkToken }} </b>

  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem error esse illo laboriosam
    laudantium. Accusantium aspernatur cumque deleniti doloribus eaque, et incidunt ipsam iste,
    minus nemo nisi nobis obcaecati quasi quibusdam quo saepe tenetur. A, accusamus alias animi
    aperiam dolore dolorem dolores eaque eligendi eos error inventore ipsum iste laboriosam
    necessitatibus neque nisi omnis optio porro quas rem repudiandae sint temporibus! Accusantium
    doloremque, dolorum, earum error et facilis fugit hic labore laboriosam natus nemo placeat porro
    quas quo repudiandae sequi sint suscipit! Exercitationem hic iste perspiciatis rerum sequi.
    Alias eligendi eveniet non ratione sapiente sint temporibus unde! Amet, cum eaque.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam, asperiores cum deserunt
    distinctio ea eius, laboriosam modi nulla numquam odit pariatur placeat quibusdam repellendus
    rerum sit voluptates! Cum dolor eum excepturi magnam magni nesciunt nobis quae quisquam
    repellat? Blanditiis cupiditate deleniti dolore dolorum ducimus fugit inventore ipsa iure,
    nesciunt odit, officiis placeat quas, ratione reiciendis repellendus rerum saepe sed!
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aliquam consequuntur
    deserunt dolor earum error excepturi iusto laboriosam maiores, necessitatibus perspiciatis
    quibusdam quo quod reiciendis rem ullam? Eum molestias odio provident voluptates! Accusamus
    earum expedita, explicabo itaque quaerat reprehenderit ullam veniam. Cupiditate earum fugiat
    perferendis quae sint temporibus? Adipisci alias animi asperiores blanditiis, consequuntur
    delectus dolorum odit tempora. Incidunt?
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda consectetur consequuntur
    dolores doloribus ea est expedita fugiat illo iste itaque labore minima necessitatibus nisi,
    officia optio quasi ratione reiciendis repellat velit veritatis. Alias cum neque pariatur
    possimus voluptatum. Alias consequatur consequuntur cumque dicta dignissimos dolor dolorem
    ducimus excepturi explicabo fugit laudantium minima molestias omnis pariatur, perferendis
    recusandae repellat repellendus repudiandae sint voluptatibus. Accusantium ad, at delectus
    deleniti dolorum enim ipsa iure nisi non numquam quae quasi repellat, soluta? Accusamus
    accusantium aliquid amet assumenda blanditiis consectetur consequuntur doloribus ducimus eaque
    et, fugit hic in iste iusto labore libero maiores molestiae molestias nesciunt nisi nostrum
    odio, odit optio perferendis qui quia quidem recusandae reiciendis rem saepe similique sint
    sunt, tenetur. Architecto autem corporis deserunt exercitationem libero nemo quasi recusandae?
    Alias atque commodi doloremque ea, laborum, magnam minima perferendis rem rerum sit tenetur
    veritatis. Ab accusamus aspernatur blanditiis consequatur dolores, enim error minima molestiae
    nam, possimus quia sequi, sunt ullam unde voluptate voluptatibus.
  </p>
</template>

<script setup lang="ts">
interface Props {
  sdkToken?: string
}

withDefaults(defineProps<Props>(), {
  sdkToken: '',
})
</script>
