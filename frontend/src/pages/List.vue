<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const projects = ref([]) 
const loading = ref(true)

// ฟังก์ชันดึงข้อมูลทั้งหมดจาก Backend
const fetchProjects = async () => {
  try {
    loading.value = true
    // เรียกไปที่ Get findAll() ใน NestJS
    const response = await axios.get('http://localhost:5000/projects')
    console.log('ข้อมูลที่ได้รับ:', response.data)
    projects.value = response.data
  } catch (error) {
    console.error('ไม่สามารถโหลดข้อมูลได้:', error)
  } finally {
    loading.value = false
  }
}

const deleteProject = async (id) => {
if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) return

  try {
    await axios.delete(`http://localhost:5000/projects/${id}`)
    projects.value = projects.value.filter(item => item.id !== id)
    console.log(`ลบ ID: ${id} เรียบร้อยแล้ว`)
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error)
    alert('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง')
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-6">
          <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2"></v-btn>
          <h1 class="text-h4 font-weight-bold">รายการข้อมูลทั้งหมด</h1>
        </div>

        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

        <v-row v-else-if="projects.length > 0">
          <v-col v-for="item in projects" :key="item.id" cols="12" md="6">
            <v-card border variant="flat" class="rounded-lg pa-2">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar color="primary-lighten-4" class="mr-3">
                    <v-icon color="primary">mdi-folder-outline</v-icon>
                  </v-avatar>
                </template>
                <v-card-title class="text-h6">{{ item.title }}</v-card-title>
                <v-chip size="x-small" :color="item.category === 'งานด่วน' ? 'error' : 'primary'" class="mt-1">
                  {{ item.category }}
                </v-chip>
              </v-card-item>

              <v-card-text class="text-body-2 text-grey-darken-1">
                {{ item.description || 'ไม่มีคำอธิบาย' }}
              </v-card-text>
              
              <v-divider class="mx-4"></v-divider>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  variant="text"  
                  color="error" 
                  icon="mdi-pencil-outline" 
                  size="small"
                  @click="goToEdit(item.id)" 
                ></v-btn>
                <v-btn 
                  variant="text" 
                  color="error" 
                  icon="mdi-delete-outline" 
                  size="small"
                  @click="deleteProject(item.id)" 
                ></v-btn> 
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-card v-else variant="flat" border class="pa-12 text-center rounded-lg">
          <v-icon size="64" color="grey-lighten-1">mdi-database-off-outline</v-icon>
          <p class="mt-4 text-grey">ยังไม่มีการบันทึกข้อมูลในระบบ</p>
          <v-btn color="primary" class="mt-4" to="/create">เพิ่มข้อมูลตอนนี้</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>