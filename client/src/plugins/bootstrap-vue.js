import Vue from "vue";

import BootstrapVue from "bootstrap-vue";
import BootstrapVueIcons from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";

import { BIconArrowClockwise } from "bootstrap-vue";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.component("BIconArrowClockwise", BIconArrowClockwise);
