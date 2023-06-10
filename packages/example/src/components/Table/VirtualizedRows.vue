<script lang="tsx">
import {
  ColumnDef,
  FlexRender,
  SortingState,
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  Row,
} from "@tanstack/vue-table";
import { ComputedRef, computed, defineComponent, ref, watch } from "vue";
import { Person } from "./makeData";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { array } from "vue-types";
import type { ColumnType } from "./interface";

export default defineComponent({
  props: {
    columns: array<ColumnType<Person>>().def(),
    dataSource: array<Person>().def(),
  },
  setup(props) {
    const sorting = ref<SortingState>([]);

    const columns: ComputedRef<ColumnDef<Person>[]> = computed(() => {
      return props.columns.map((col) => ({
        accessorKey: col.dataIndex,
        header: col.title,
        size: col.width,
        accessorFn: col.customHeaderCell,
        align: 'left',
      } as ColumnDef<Person>));
    });

    // const data = ref(makeData(50_000));

    const table = useVueTable<Person>({
      get data() {
        // return data.value;
        return props.dataSource;
      },
      columns: columns.value,
      state: {
        get sorting() {
          return sorting.value;
        },
      },
      onSortingChange: (updaterOrValue) => {
        sorting.value =
          typeof updaterOrValue === "function"
            ? updaterOrValue(sorting.value)
            : updaterOrValue;
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    });

    const tableContainerRef = ref();

    const { rows } = table.getRowModel();
    const rowVirtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => tableContainerRef.value,
      estimateSize: () => 35,
      overscan: 10,
    });

    return () => {
      const virtualRows = rowVirtualizer.value.getVirtualItems();
      const totalSize = rowVirtualizer.value.getTotalSize();

      const paddingTop =
        virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
      const paddingBottom =
        virtualRows.length > 0
          ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
          : 0;
      return (
        <div class="p-2">
          <div class="h-2" />
          <div ref={tableContainerRef} class="container">
            <table class="virtual-table">
              <thead class="virtual-table-head">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          class="virtual-table-cell"
                          key={header.id}
                          colspan={header.colSpan}
                          style={{ width: `${header.getSize()}px` }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                class: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              <FlexRender
                                render={header.column.columnDef.header}
                                props={header.getContext()}
                              />
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody class="virtual-table-body">
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<Person>;
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td class="virtual-table-cell" key={cell.id}>
                            <FlexRender
                              render={cell.column.columnDef.cell}
                              props={cell.getContext()}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>{table.getRowModel().rows.length} Rows</div>
        </div>
      );
    };
  },
});
</script>
<style lang="less">
html {
  font-family: sans-serif;
  font-size: 14px;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  font-family: arial, sans-serif;
  table-layout: fixed;
  width: 100%;
}

.container {
  // border: 1px solid lightgray;
  height: 500px;
  max-width: 900px !important;
  overflow: auto;
}

.virtual-table {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  &-head {
    @apply sticky top-0;
    .virtual-table-cell {
      @apply relative text-black/80 font-semibold text-start bg-gray-2 border-b border-solid border-gray-4 transition-colors;
      &:not(:last-child)::before {
        @apply absolute content-[''] top-1/2 end-0 w-[1px] h-[1.6em] bg-gray-4 -translate-y-1/2 transition-colors;
      }
    }
  }

  &-body {
    .virtual-table-cell {
      @apply border-b border-solid border-gray-4 transition-colors;
    }
  }

  &-cell {
    @apply p-4 break-words;
  }
}
</style>
