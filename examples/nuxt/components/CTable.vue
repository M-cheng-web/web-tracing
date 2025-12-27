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
          <template #default="scope">
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
          <template #default="scope">
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
  </div>
</template>

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
</script>

<style lang="scss" scoped>
.c-table {
  background-color: #fff;

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
