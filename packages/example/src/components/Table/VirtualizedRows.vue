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
import { defineComponent, ref, watch } from "vue";
import { Person, makeData } from "./makeData";
import { useVirtualizer } from "@tanstack/vue-virtual";

export default defineComponent({
  setup() {
    const sorting = ref<SortingState>([]);

    const columns: ColumnDef<Person>[] = [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        size: 50,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        size: 80,
      },
      {
        accessorKey: "createAt",
        header: "Created At",
        cell: (info) => info.getValue<Date>()?.toLocaleString(),
      },
    ];

    const data = ref(makeData(50_000));

    const table = useVueTable({
      get data() {
        return data.value;
      },
      columns,
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
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colspan={header.colSpan}
                          style={{ width: header.getSize() }}
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
              <tbody>
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
                          <td key={cell.id}>
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
<style>
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

thead {
  background: lightgray;
  margin: 0;
  position: sticky;
  top: 0;
}

th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
  text-align: left;
}

td {
  padding: 6px;
}

.container {
  border: 1px solid lightgray;
  height: 500px;
  max-width: 900px !important;
  overflow: auto;
}
</style>
