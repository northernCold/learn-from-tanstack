<template>
  <div
    ref="parentRef"
    class="List"
    :style="{
      height: '500px',
      width: '500px',
      overflow: 'auto',
    }"
  >
    <div
      :style="{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: `${columnVirtualizer.getTotalSize()}px`,
        position: 'relative',
      }"
    >
      <template
        v-for="virtualRow in rowVirtualizer.getVirtualItems()"
        :key="virtualRow.index"
      >
        <template
          v-for="virtualColumn in columnVirtualizer.getVirtualItems()"
          :key="virtualColumn.index"
        >
          <div
            :class="
              virtualColumn.index % 2
                ? virtualRow.index % 2 === 0
                  ? 'ListItemOdd'
                  : 'ListItemEven'
                : virtualRow.index % 2
                ? 'ListItemOdd'
                : 'ListItemEven'
            "
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${virtualColumn.size}px`,
              height: `${virtualRow.size}px`,
              transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
            }"
          >
            Cell {{ virtualRow.index }}, {{ virtualColumn.index }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVirtualizer } from "@tanstack/vue-virtual";
import { ref } from "vue";

const parentRef = ref();

const rowVirtualizer = useVirtualizer({
  count: 10000,
  getScrollElement: () => parentRef.value,
  estimateSize: () => 35,
  overscan: 5,
});

const columnVirtualizer = useVirtualizer({
  horizontal: true,
  count: 10000,
  getScrollElement: () => parentRef.value,
  estimateSize: () => 100,
  overscan: 5,
});
</script>
<style>
html {
  font-family: sans-serif;
  font-size: 14px;
}

body {
  padding: 1rem;
}

.List {
  border: 1px solid #e6e4dc;
  max-width: 100%;
}

.ListItemEven,
.ListItemOdd {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ListItemEven {
  background-color: #e6e4dc;
}

button {
  border: 1px solid gray;
}
</style>