<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import DefaultLayout from '@/components/DefaultLayout.vue'

const router = useRouter()

const formData = ref({
  title: '',
  description: '',
  category: 'ทั่วไป'
}) 

const saveData = async () => {
  try {
    const response = await axios.post('http://localhost:5000/projects', formData.value);
    if (response.status === 201 || response.status === 200) {
      Swal.fire({
        title: 'บันทึกข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonColor: '#6200EA',
        customClass: {
          popup: 'rounded-xl'
        }
      });
      formData.value = { title: '', description: '', category: 'ทั่วไป' };
      router.push('/');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'บันทึกไม่สำเร็จ!',
      text: 'กรุณาตรวจสอบการเชื่อมต่อ Backend',
      icon: 'error',
      confirmButtonColor: '#6200EA'
    });
  }
}
</script>

<template>
  <DefaultLayout>
    <v-row justify="center" align="start">
      <v-col cols="12" md="8" lg="6">
        
        <v-card 
          variant="flat" 
          class="pa-8 rounded-xl overflow-hidden shadow-fancy position-relative"
          style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.4);"
        >
          <div class="gradient-bar"></div>

          <v-form @submit.prevent="saveData">
            <div class="mb-8 mt-4">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-plus-circle-outline" color="deep-purple-accent-4" size="32" class="mr-2"></v-icon>
                <h1 class="text-h4 text-grey-darken-4">เพิ่มข้อมูลใหม่</h1>
              </div>
            </div>

            <v-text-field
              v-model="formData.title"
              label="หัวข้องานของคุณ"
              placeholder="เช่น พัฒนาหน้าจอ Dashboard"
              variant="outlined"
              color="deep-purple-accent-4"
              prepend-inner-icon="mdi-format-title"
              class="mb-3 custom-input"
              required
            ></v-text-field>

            <v-textarea
              v-model="formData.description"
              label="รายละเอียดเพิ่มเติม"
              placeholder="อธิบายรายละเอียดงานสั้นๆ..."
              variant="outlined"
              color="deep-purple-accent-4"
              prepend-inner-icon="mdi-text-subject"
              rows="4"
              class="mb-3 custom-input"
            ></v-textarea>

            <v-select
              v-model="formData.category"
              :items="['ทั่วไป', 'งานด่วน', 'ส่วนตัว']"
              label="หมวดหมู่"
              variant="outlined"
              color="deep-purple-accent-4"
              prepend-inner-icon="mdi-tag-multiple-outline"
              class="mb-6 custom-input"
            ></v-select>

            <v-divider class="mb-8 opacity-50"></v-divider>

            <div class="d-flex align-center">
              <v-btn 
                type="submit" 
                size="large"
                class="px-8 text-none rounded-lg btn-gradient"
                prepend-icon="mdi-check-circle"
              >
                บันทึกข้อมูล
              </v-btn>
              
              <v-btn 
                variant="text" 
                to="/"
                class="ml-4 text-none text-grey-darken-1 btn-cancel"
                size="large"
              >
                ยกเลิก
              </v-btn>
            </div>
          </v-form>
        </v-card>

      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<style scoped>
.shadow-fancy {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05) !important;
}
.btn-gradient {
  background: linear-gradient(45deg, #6200EA, #7C4DFF) !important;
  color: white !important;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-cancel {
 background: #F3E5F5 !important; 
  color: #6200EA !important; 
  border-color: #6200EA !important;
  transition: all 0.3s ease;
}
:deep(.custom-input .v-field--outlined) {
  border-radius: 12px !important;
}

:deep(.v-field--focused .v-field__outline) {
  border-width: 2px !important;
}
</style>