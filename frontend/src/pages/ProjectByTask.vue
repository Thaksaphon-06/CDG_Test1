<template>
  <DefaultLayout>
  <v-container>
    <h2>Project Resource Overview</h2>
    <v-data-table :headers="headers" :items="projects" class="elevation-1">
      <template v-slot:item.progress="{ item }">
        <v-progress-linear
          :model-value="(item.usedMD / item.totalMD) * 100"
          :color="getProgressColor(item)"
          height="20"
          striped
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </template>
    </v-data-table>
  </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/components/DefaultLayout.vue';

const headers = [
  { title: 'Project Name', key: 'name' },
  { title: 'Total Tasks', key: 'taskCount' },
  { title: 'Plan (MD)', key: 'totalMD' },
  { title: 'Used (MD)', key: 'usedMD' },
  { title: 'Usage Status', key: 'progress' },
];

const getProgressColor = (item) => {
  const ratio = item.usedMD / item.totalMD;
  return ratio > 0.9 ? 'red' : ratio > 0.7 ? 'orange' : 'green';
};
</script>