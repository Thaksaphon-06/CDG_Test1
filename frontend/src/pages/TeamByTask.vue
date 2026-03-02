<template>
    <default-layout>
  <v-container fluid>
    <h2 class="mb-4">Team Workload Distribution</h2>
    <v-row>
      <v-col v-for="member in teamData" :key="member.id" cols="12" md="4">
        <v-card variant="outlined">
          <v-card-item title="Member Name">
            <template v-slot:prepend>
              <v-avatar color="primary">{{ member.name[0] }}</v-avatar>
            </template>
            <v-card-title>{{ member.name }}</v-card-title>
            <v-card-subtitle>{{ member.role }}</v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <v-list density="compact">
            <v-list-subheader>ACTIVE TASKS (Total: {{ member.totalMD }} MD)</v-list-subheader>
            <v-list-item v-for="task in member.tasks" :key="task.id">
              <v-list-item-title>{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ task.projectName }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="small" variant="flat" color="blue-lighten-4">
                  {{ task.md }} MD
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </default-layout>
</template>

<script setup>
import DefaultLayout from '@/components/DefaultLayout.vue';

const teamData = [
  {
    id: 1, name: 'Touchhh', role: 'Full Stack Developer', totalMD: 4.5,
    tasks: [
      { id: 101, title: 'API Authentication', projectName: 'SkillEx', md: 2 },
      { id: 102, title: 'Database Migration', projectName: 'SkillEx', md: 2.5 },
    ]
  },
  // เพิ่มสมาชิกคนอื่นๆ ...
];
</script>