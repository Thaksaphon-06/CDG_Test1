<template>
  <v-app>
    <v-layout style="height: 100vh; overflow: hidden;">
      
      <v-app-bar color="deep-purple-accent-4" elevation="1">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title class="font-weight-bold">My Web Test</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-bell-outline" variant="text"></v-btn>
        </template>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : 'left'"
        temporary
        class="pa-2"
      >
        <v-list density="compact" nav>
          <v-list-item 
            prepend-icon="mdi-home-variant-outline" 
            title="Home" 
            value="home"
            @click="navigateTo('/')"
          ></v-list-item>

          <v-list-item 
            prepend-icon="mdi-format-list-bulleted" 
            title="All List" 
            value="list"
            @click="navigateTo('/list')"
          ></v-list-item>

                    <v-list-item 
            prepend-icon="mdi-calendar-month-outline" 
            title="ProjectByTask" 
            value="ProjectByTask"
            @click="navigateTo('/projectbytask')"
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-calendar-month-outline" 
            title="TeamByTask" 
            value="teambytask"
            @click="navigateTo('/teambytask')"
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-calendar-month-outline" 
            title="TeamCapacity" 
            value="teamcapacity"
            @click="navigateTo('/teamcapacity')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh; overflow-y: auto;">
        <v-container fluid class="pa-6">
          <v-row justify="start" align="start">
            <v-col cols="12">
               <slot />
            </v-col>
          </v-row>
        </v-container>
      </v-main>

    </v-layout>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)

const navigateTo = (path) => {
  router.push(path)
  drawer.value = false
}
</script>

<style>
html, body {
  overflow: hidden !important;
  height: 100%;
}
</style>