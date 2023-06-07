<template>
  <div class="c-table">
    <el-table
      stripe
      :height="tableHeight"
      :data="data"
      header-row-class-name="table-header"
    >
      <template v-for="(item, index) in config">
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
    <div class="pagination">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'CTable',
  props: {
    data: { type: Array, default: [] },
    tableHeight: { type: String, default: '250' },
    config: {
      type: Array,
      default: [
        {
          label: '',
          prop: '',
          width: '',
          isTemplate: false
        }
      ]
    },
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        pageSize: 10,
        total: 0,
        pageSizesSelect: [10, 20, 30, 40]
      })
    }
  },
  methods: {
    pageSizeChange(val) {
      this.$emit('pageSizeChange', val)
    },
    pageChange(val) {
      this.$emit('pageChange', val)
    },
    substr40(val) {
      val = val && val.length > 40 ? val.substr(0, 40) + '...' : val
      return val
    }
  }
}
</script>

<style lang="scss" scoped>
.c-table {
  background-color: #fff;
  padding-bottom: 24px;

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
