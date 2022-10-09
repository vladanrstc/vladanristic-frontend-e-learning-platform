import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import VueI18n from 'vue-i18n'
import translations from '../translations.json'
import CKEditor from '@ckeditor/ckeditor5-vue';
import VueSweetalert2 from 'vue-sweetalert2';
import Vuelidate from 'vuelidate'
import axios from 'axios'
import vueDebounce from 'vue-debounce'
import VueApexCharts from 'vue-apexcharts'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { runInContext } from 'lodash'

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(CKEditor)
Vue.use(VueSweetalert2)
Vue.use(Vuelidate)
Vue.use(vueDebounce)
Vue.use(VueRouter)
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

export const bus = new Vue();

Vue.config.productionTip = true

let routes = [
  {
      path: '/',
      name: 'Home',
      component:() => import("./views/Home.vue")
  },
  {
      path: '/courses',
      name: 'Courses',
      component:() => import("./views/Courses.vue")
  },
  {
      path: '/lessons/:course',
      name: 'Lessons',
      component:() => import("./views/Lessons.vue")
  },  
  {
      path: '/contact',
      name: 'Contact',
      component:() => import("./views/Contact.vue")
  },
  {
    path: '/about',
    name: 'About',
    component:() => import("./views/About.vue")
  },
  {
      path: '/:token/confirmed',
      name: 'HomeConfirmedAccount',
      component:() => import("./views/Home.vue")
  },
  {
      path: '/admin',
      name: 'AdminDashboard',
      component:() => import("./views/admin/AdminDashboard.vue")
  }
  // admin routes
  ,{
      path: '/admin/users',
      name: 'AdminUsers',
      component:() => import("./views/admin/manage/Users.vue")
  },{
      path: '/admin/courses',
      name: 'AdminCourses',
      component:() => import("./views/admin/manage/Courses.vue")
  },
  {
      path: '/admin/sections/:course',
      name: 'AdminSections',
      component:() => import("./views/admin/manage/Sections.vue")
  },
  {
      path: '/admin/sections/:course/lessons/:section',
      name: 'AdminLessons',
      component:() => import("./views/admin/manage/Lessons.vue")
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const messages = translations;

const i18n = new VueI18n({
    locale: 'sr',
    messages,
})

Vue.filter('shorten', function (value) {
    return value.substring(0, 90) + "...";
});

Vue.prototype.$hostname = 'http://vladanristic.site'
Vue.prototype.$hostname_frontend = 'http://localhost:8080'

window.Swal = VueSweetalert2;

router.beforeEach((to, from, next) => {

  if(!/admin/.test(to.path)) {
    if(localStorage.getItem("ac_t") != null) {
        let a = JSON.parse(atob(localStorage.getItem("ac_t").split('.')[1]));

        if(a.scopes[0] == "super-admin" || a.scopes[0] == "admin") {
            location.replace("/admin");
        }
    }
    
  }

  if(/admin/.test(to.path)) {

      axios.get("/auth/check-admin")
          .then(() => {
              next();
              //loading.close();
          }).catch(() => {

        localStorage.removeItem("ac_t")
        location.replace("/");

      });

  } else {
      next();
  }
})

/*
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
*/

axios.defaults.baseURL = 'http://vladanristic.site/api/';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ac_t');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

const app = new Vue({
  i18n,
  el: '#app',
  router: router,
  render: h => h(App)
})