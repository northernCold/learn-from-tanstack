<script setup lang="ts">
import { ref } from "vue";
// import GridFixed from "./components/virtual/GridFixed.vue";
import VirtualizedRows from "./components/table/VirtualizedRows.vue";
import { ColumnType } from "./components/table/interface";
import { Person, makeData } from "./components/table/makeData";

interface DataType {
  name: string;
  age: number;
  address: string;
}

const columns: ColumnType<Person>[] = [
  {
    title: "ID",
    dataIndex: "id",
    width: 60,
  },
  {
    title: "First Name",
    dataIndex: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    width: 100,
  },
  {
    title: "Age",
    dataIndex: "age",
    width: 60,
  },
  {
    title: "Visits",
    dataIndex: "visits",
    width: 70,
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Profile Progress",
    dataIndex: "progress",
    width: 160,
  },
  {
    title: "Created At",
    dataIndex: "createAt",
  },
];

const data = ref(makeData(50_000));
</script>

<template>
  <VirtualizedRows :columns="columns" :data-source="data" />
</template>
