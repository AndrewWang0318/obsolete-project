<template>
  <div class="cte-pager">
    <div class="tool-select-size">
      <el-select filterable v-model="size" @change="pageSizeChange" placeholder="" size="small">
        <el-option v-for="item in default_prop_size" :key="item" :label="`${item}条/页`" :value="item" />
      </el-select>
    </div>
    <div class="symbol-divid"></div>
    <div class="tool-page">
      <div class="btn-prevest" @click="startPage">
        <el-icon class="icon" color="#2486EE">
          <DArrowLeft />
        </el-icon>
      </div>
      <div class="btn-prev" @click="prevPage">
        <el-icon class="icon" color="#2486EE">
          <CaretLeft />
        </el-icon>
      </div>
      <div class="symbol-divid"></div>
      <div class="input-page">
        <div>第</div>
        <div>
          <el-input v-model="current_page" placeholder="" @change="pageCurrentChange" />
        </div>
        <div class="page-info">共{{ all_page }}页</div>
      </div>
      <div class="symbol-divid"></div>
      <div class="btn-next" @click="nextPage">
        <el-icon class="icon" color="#2486EE">
          <CaretRight />
        </el-icon>
      </div>
      <div class="btn-nextest" @click="endPage">
        <el-icon class="icon" color="#2486EE">
          <DArrowRight />
        </el-icon>
      </div>
      <div class="symbol-divid"></div>
    </div>
    <div class="tool-refresh">
      <div class="btn-refresh" @click="refresh">
        <el-icon class="icon" color="#2486EE">
          <RefreshRight />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CtePager',
  props: {
    prop_total: {
      type: Number,
      default: () => 1
    },
    prop_size: {
      type: Number,
      default: () => 10
    },
    default_prop_size: {
      type: Array,
      default: () => [10, 20, 30]
    },
    prop_page: {
      type: Number,
      default: () => 1
    }
  },
  data() {
    return {
      size: 10,
      current_page: 1,
      all_page: 1,
    }
  },
  watch: {
    'prop_page': function (nval, oval) { // 总数改变
      this.current_page = nval;
    },
    // 'size':function(nval,oval){ // 分页大小改变
    //   this.all_page = Math.ceil(this.prop_total / this.size);
    // },
    'prop_total': function (nval, oval) { // 总数改变
      this.all_page = Math.ceil(this.prop_total / this.size);
    }
  },
  mounted() {
    this.size = this.prop_size;
    // this.size = this.default_prop_size;
    this.all_page = Math.ceil(this.prop_total / this.size);
  },
  methods: {
    refresh() { // 刷新
      this.$emit('refresh');
    },
    startPage() { // 起始页
      if (this.current_page > 1) {
        this.current_page = 1;
        this.$emit('update:prop_page', this.current_page);
        this.$emit('size-change', this.current_page);
      } else {
        return
      }
    },
    endPage() { // 最后一页
      if (this.current_page < this.all_page) {
        this.current_page = this.all_page;
        this.$emit('update:prop_page', this.current_page);
        this.$emit('current-change', this.current_page);
      } else {
        return
      }
    },
    prevPage() { // 上一页
      if (this.current_page > 1) {
        this.current_page = this.current_page - 1;
        this.$emit('update:prop_page', this.current_page);
        this.$emit('current-change', this.current_page);
      } else {
        return
      }
    },
    nextPage() { // 下一页
      if (this.current_page < this.all_page) {
        this.current_page = Number(this.current_page) + 1;
        this.$emit('update:prop_page', this.current_page);
        this.$emit('current-change', this.current_page);
      } else {
        return
      }
    },
    pageSizeChange(val) { // 分页大小改变
      // 更新数据需要放在触发传值事件之前
      this.all_page = Math.ceil(this.prop_total / this.size);
      this.$emit('update:prop_size', val);
      if (this.current_page > this.all_page) {
        this.current_page = this.all_page
      }
      this.$emit('update:prop_page', this.current_page);

      this.$emit('size-change', val);
    },
    pageCurrentChange(val) {  // 当前页改变
      if (val < 1) {
        this.current_page = 1
      } else if (val > this.all_page) {
        this.current_page = this.all_page
      }
      this.$emit('update:prop_page', this.current_page);
      this.$emit('current-change', this.current_page);
    }
  }
}
</script>

<style lang="scss" scoped>
.cte-pager {
  display: flex;
  align-items: center;
  // background-color: rgb(214, 214, 214);
  padding: 0 0 0 10px;
  box-sizing: border-box;
  height: 32px;

  // .tool-size{
  //   margin-right: 8px;
  //   :deep(.el-input-number--small){
  //     width: 60px;
  //     .el-input__inner{
  //       margin-left: -24px;
  //     }
  //   }
  //   :deep(.el-input__wrapper){
  //     padding: 0;
  //   }
  // }
  .tool-select-size {
    margin-right: 8px;

    :deep(.el-input__wrapper) {
      width: 64px;
    }
  }

  .tool-page {
    display: flex;
    align-items: center;
    line-height: 1;
    margin-left: 6px;
    margin-right: 6px;

    font-size: 14px;

    .btn-prevest {
      cursor: pointer;
    }

    .btn-prev {
      cursor: pointer;
      margin-right: 6px;
      margin-left: 8px;

      .icon {
        font-size: 16px;
      }
    }

    .btn-next {
      cursor: pointer;
      margin-right: 8px;
      margin-left: 6px;

      .icon {
        font-size: 16px;
      }
    }

    .btn-nextest {
      margin-right: 6px;
      cursor: pointer;
    }

    .input-page {
      margin-left: 8px;
      margin-right: 8px;
      display: flex;
      align-items: center;

      :deep(.el-input__wrapper) {
        width: 34px;
        height: 24px;
        padding: 0;
      }

      :deep(.el-input__inner) {
        text-align: center;
      }
    }
  }

  .tool-refresh {
    margin-left: 6px;

    .btn-refresh {
      line-height: 1;
      cursor: pointer;

      .icon {
        font-size: 16px;
      }
    }
  }

  .symbol-divid {
    width: 1px;
    height: 18px;
    background-color: rgb(200, 200, 200);
  }
}</style>