<template>
  <div
    ref="parentRef"
    class="List"
    :style="{ height: '200px', width: '400px', overflow: 'auto' }"
  >
    <div
      :style="{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative'
      }">
      <template v-for="virtualRow in rowVirtualizer.getVirtualItems()" :key="virtualRow.index">
        <div
          :class="virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`
          }"
        >
          Row {{ virtualRow.index }}
      </div>
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
</script>
