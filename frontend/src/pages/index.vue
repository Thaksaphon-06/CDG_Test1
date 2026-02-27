<template>
  <DefaultLayout>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          
          <v-card 
            variant="flat" 
            class="pa-8 rounded-xl overflow-hidden shadow-fancy"
            style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);"
          >
            <div class="gradient-bar"></div>

            <v-card-item class="text-center pb-8">
              <v-icon 
                icon="mdi-rocket-launch-outline" 
                size="64" 
                color="deep-purple-accent-4" 
                class="mb-4"
              ></v-icon>
              
              <v-card-title class="text-h3 text-grey-darken-4">
                ยินดีต้อนรับ!
              </v-card-title>
         
            </v-card-item>

            <v-divider class="mb-8 opacity-50"></v-divider>

            <v-row justify="center">
              <v-col cols="6">
                <v-btn
                  size="large"                  
                  block
                  class="text-none rounded-lg elevation-4 btn-main-gradient"
                  prepend-icon="mdi-plus-circle"
                  @click="goToCreate"
                >
                  เริ่มสร้างงานใหม่
                </v-btn>
              </v-col>
              </v-row>


              <v-row justify="center">
              <v-col cols="6">
                <v-btn
                  size="large"
                  block
                  class="text-none rounded-lg elevation-4 btn-secondary-soft"
                  prepend-icon="mdi-view-dashboard-variant"
                  @click="goToList"
                >
                  ดูรายการข้อมูลทั้งหมด
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/DefaultLayout.vue'

const router = useRouter()

const goToCreate = () => {
  router.push('/create')
}
const goToList = () => {
  router.push('/list')
}
</script>

<style scoped>

.shadow-fancy {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05) !important;
}

.btn-main-gradient {
  background: linear-gradient(45deg, #6200EA, #9D50BB) !important;
  color: white !important;
  transition: all 0.3s ease;
}

.btn-secondary-soft {
  background: #F3E5F5 !important; 
  color: #6200EA !important; 
  border-color: #6200EA !important;
  transition: all 0.3s ease;
}

.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
}
</style>