<template>
  <div class="c-table">
    <el-table
      stripe
      :height="props.tableHeight"
      :data="props.data"
      header-row-class-name="table-header"
    >
      <template v-for="(item, index) in props.config">
        <el-table-column
          v-if="item.prop !== 'operate'"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :key="index"
          show-overflow-tooltip
        >
          <template v-slot="scope">
            <div v-if="item.isTemplate">
              <slot
                :name="item.prop"
                :scope="{
                  row: scope.row,
                  column: scope.column,
                  index: scope.$index
                }"
              />
            </div>
            <div v-else>{{ scope.row[item.prop] }}</div>
          </template>
        </el-table-column>

        <!-- 操作栏 -->
        <el-table-column
          v-else
          fixed="right"
          :width="item.width"
          :label="item.label"
          :key="index + 'right'"
        >
          <template v-slot="scope">
            <slot
              name="operate"
              :scope="{
                row: scope.row,
                column: scope.column,
                index: scope.$index
              }"
            />
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <!-- <div class="pagination">
      <el-pagination
        background
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizesSelect"
        layout="prev, pager, next"
        @size-change="pageSizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
    </div> -->
  </div>
</template>

<script lang="ts">
export default {
  name: 'CTable'
}
</script>

<script setup lang="ts">
interface Props {
  data: any[]
  tableHeight?: string
  config?: any[]
  pagination?: object
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  tableHeight: '250',
  config: () => [
    {
      label: '',
      prop: '',
      width: '',
      isTemplate: false
    }
  ],
  pagination: () => ({
    page: 1,
    pageSize: 10,
    total: 0,
    pageSizesSelect: [10, 20, 30, 40]
  })
})

// const emit = defineEmits<{
//   (e: 'pageSizeChange', value: any): void
//   (e: 'pageChange', value: any): void
// }>()
// function pageSizeChange(val) {
//   emit('pageSizeChange', val)
// }
// function pageChange(val) {
//   emit('pageChange', val)
// }
</script>

<style lang="scss" scoped>
.c-table {
  background-color: #fff;
  // padding-bottom: 24px;

  :deep(.table-header th) {
    height: 54px;
    background-color: #fafafa;
    color: #1f2226;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
