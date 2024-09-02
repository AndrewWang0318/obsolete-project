<template>
  <div class="__drag-tab">
    <draggable class="tab-stock" :list="current_tab_stock" group="site" animation="300">
      <template #item="{ element }">
        <div :key="element.key + 'tab-stock-item'" :class="`tab-stock-item ${element.active ? 'active-type' : 'normal-type'
          }`">
          <div class="tab-title" @click="breadCrumbClick(element)">
            {{ element.title }}
          </div>
          <div class="btn-close" @click="breadCrumbClose(element)">x</div>
        </div>
      </template>
    </draggable>

    <div class="close-menu" v-show="should_close_menu_show">
      <div class="close-item" @click="closeOtherMenu">关闭其他</div>
      <div class="close-item" @click="closeAllMenu">关闭全部</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DragTab",
};
</script>

<script setup>
import draggable from "vuedraggable";
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance, ref, reactive, watch, defineProps } from "vue"; // reactive用于复杂对象,ref简单的值

const instance = getCurrentInstance();// vue实例
console.log(instance.appContext.app.config.$mutil); // 注册的方法
const router = useRouter(); // router路由对象
const route = useRoute(); // router路由对象
const props = defineProps({
  router_menu: {
    // 项目路由信息
    type: Array,
    required: true,
    default: () => [{
      title: '主页',// 名称,不唯一
      route: '/Home',// 路由,唯一
    },
    {
      title: '关于',// 名称,不唯一
      route: '/About',// 路由,唯一
    },
    {
      title: '标题页',// 名称,不唯一
      route: '/Title',// 路由,唯一
    },
    {
      title: '错误',// 名称,不唯一
      route: '/Error',// 路由,唯一
    }],
  },
  use_storage: {
    // 是否启用本地储存
    type: String,
    default: "no",
  },
});


console.log(props)
let should_close_menu_show = ref(false); // 是否显示关闭其他及关闭全部
let default_tab_stock = reactive(props.router_menu);
let tab_stock = reactive([]); // 根据默认导航栈数据处理后的路由栈数据
default_tab_stock.forEach((item) => {
  tab_stock.push({ title: item.title, route: item.route, key: item.route });
});

let current_tab_stock = reactive([]); // 当前导航栈
let current_route_stock = []; // 当前路由栈
// 启动当前路由栈中的项
const activeAimTab = (key) => {
  current_tab_stock.forEach((item) => {
    if (item.key == key) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};
// 添加新的路由栈的项
const addAimTab = (current_route, tab_stock_item) => {
  const { fullPath, hash, href, meta, name, path, params, query } =
    current_route;
  let current_tab_stock_item = {
    fullPath,
    hash,
    href,
    meta,
    name,
    path,
    params,
    query,
    title: tab_stock_item.title,
    key: tab_stock_item.key,
    active: true,
  };
  current_tab_stock.push(current_tab_stock_item);
  current_route_stock.push(current_tab_stock_item);
};
// 监听路由变化
watch(
  () => router.currentRoute.value,
  (current_route) => {
    // 通过在所有默认路由数据中查询是否存在当前路由,没有则访问路由不存在,有则需要二次判断
    let is_exist_in_tab_stock = false; // 是否在默认路由栈中存在
    let tab_stock_item = null; // 默认路由栈中找到的条目
    for (let i = 0; i < tab_stock.length; i++) {
      const item = tab_stock[i];
      if (item.key == current_route.path) {
        is_exist_in_tab_stock = true;
        tab_stock_item = item;
        break;
      }
    }
    if (!is_exist_in_tab_stock) {
      activeAimTab("");
      return;
    }
    if (current_tab_stock.length <= 0) {
      // 如果当前路由栈长度小于等于0则直接推入
      addAimTab(current_route, tab_stock_item);
    } else {
      // 通过在当前路由中查询是否存在与当前访问路由相同的路由
      let is_exist_in_current_tab_stock = false; // 是否在当前路由栈中存在
      for (let j = 0; j < current_tab_stock.length; j++) {
        const item = current_tab_stock[j];
        if (item.key == current_route.path) {
          // 当前路由已存在
          is_exist_in_current_tab_stock = true;
        }
      }
      if (!is_exist_in_current_tab_stock) {
        addAimTab(current_route, tab_stock_item);
      }
      activeAimTab(tab_stock_item.key);
    }
  },
  { immediate: true }
);
// 点击tab导航
const breadCrumbClick = function (item) {
  let current_idx = null;
  for (let i = 0; i < current_route_stock.length; i++) {
    const element = current_route_stock[i];
    if (element.key == item.path) {
      current_idx = i;
      break;
    }
  }
  current_route_stock.splice(current_route_stock.length, 1, item); // 将目标路由添加栈前
  current_route_stock.splice(current_idx, 1); // 删除目标路由

  router.push({ path: item.path, query: item.query });
};
// 关闭tab导航
const breadCrumbClose = function (item) {
  let target_key = item.key; // 当前点击关闭的path
  let current_key = route.path; // 当前启动的path
  let current_close_idx = null; // 当前需要关闭Tab栈的下标;
  for (let j = 0; j < current_tab_stock.length; j++) {
    const element = current_tab_stock[j];
    if (element.key == target_key) {
      current_close_idx = j;
    }
  }
  current_tab_stock.splice(current_close_idx, 1);

  let current_close_i = null; // 当前需要删除路由栈的下标;
  for (let j = 0; j < current_route_stock.length; j++) {
    const element = current_route_stock[j];
    if (element.key == target_key) {
      current_close_i = j;
    }
  }
  current_route_stock.splice(current_close_i, 1);

  if (current_tab_stock.length < 1) {
    router.push("/Empty");
    return;
  } // 只有一个的路由删除后会跳转空白页

  if (target_key == current_key) {
    // 当前关闭路由为启动状态的路由,则返回为上一次的路由

    router.push({
      path: current_route_stock[current_route_stock.length - 1].path,
      query: current_route_stock[current_route_stock.length - 1].query,
    });
  }
};
// 关闭其他tab导航
const closeOtherMenu = function () { };
// 关闭所有tab导航
const closeAllMenu = function () { };

// 问题1 点击同一路由不同参数时不会代替旧路由,判断fullPath是否相等,不相等的话关闭后再打开
// 问题2 传值出现了问题
</script>

<style lang="less">
.__drag-tab {
  height: 29px;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: #fafafa;

  .tab-stock {
    display: flex;
    height: 100%;
  }

  .tab-stock-item {
    cursor: pointer;
    flex-shrink: 0;
    font-size: 13px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;

    .tab-title {
      height: 100%;
      line-height: 27px;
      padding: 0 6px 0 18px;
    }
  }

  .tab-stock-item:hover {
    border: 1px solid #4993c5;
    color: #4993c5;
  }

  .active-type {
    background-color: #eaf2fd;
    color: #308bef;
    border: 1px solid #02a7f0;
    border-radius: 0;
  }

  .normal-type {
    border: 1px solid rgb(223, 223, 223);
    background-color: #fafafa;
    box-sizing: border-box;
    border-radius: 0;
    color: #555555;

    :deep(.el-tag__close) {
      color: #555555 !important;
    }
  }

  .btn-close {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    cursor: pointer;
    padding-right: 4px;
  }

  .close-menu {
    position: absolute;
    z-index: 9;
    width: 120px;
    text-align: center;
    background-color: #fff;
    border: 1px solid rgb(180, 180, 180);
    color: #555555;

    .close-item {
      padding: 0 16px 0 16px;
      box-sizing: border-box;
      line-height: 30px;
      border-bottom: 1px solid rgb(180, 180, 180);
      cursor: pointer;
    }

    .close-item:hover {
      background-color: #eaf2fd;
    }

    .close-item:last-of-type {
      border-bottom: none;
    }
  }
}

.__drag-tab::-webkit-scrollbar {
  // 进度条样式修改
  height: 6px;
  background-color: rgb(255, 255, 255);
}

.__drag-tab::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgb(133, 133, 133);
}

// ::-webkit-scrollbar 滚动条整体部分，可以设置宽度
// ::-webkit-scrollbar-button 滚动条两端的按钮
// ::-webkit-scrollbar-track 外层轨道
// ::-webkit-scrollbar-track-piece 内层滚动槽
// ::-webkit-scrollbar-thumb 滚动的滑块
// ::-webkit-scrollbar-corner 边角
// ::-webkit-resizer 定义右下角拖动块的样式</style>
