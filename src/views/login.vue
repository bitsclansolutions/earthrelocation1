<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card class="elevation-12">
          <base-material-card class="px-5 py-3">
            <template #heading>
              <v-tabs
                v-model="tabs"
                background-color="transparent"
                slider-color="white"
                centered
                dark
              >
                <v-tab class="">
                  <v-icon>mdi-login-variant</v-icon>
                  Login
                </v-tab>
                <!-- <v-tab class="">
                  <v-icon>mdi-account-plus</v-icon>
                  Register
                </v-tab> -->
              </v-tabs>
            </template>
            <v-tabs-items v-model="tabs">
              <v-tab-item>
                <login-form />
              </v-tab-item>
              <!-- <v-tab-item>
                <register-form />
              </v-tab-item> -->
            </v-tabs-items>
          </base-material-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    components: {
      LoginForm: () => import('./dashboard/components/LoginForm'),
      RegisterForm: () => import('./dashboard/components/RegisterForm'),
    },
    data: () => ({
      tabs: 0,
    }),
  }
</script>
