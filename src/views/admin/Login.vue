<template>
  <div>

    <div class="container py-5">
      <h1>Prijava</h1>
      <b-form @submit.stop.prevent="loginAdmin">

        <b-form-group>
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="Vaš e-mail"
          ></b-form-input>
        </b-form-group>

        <b-form-group >
          <b-form-input id="input-2" type="password" v-model="form.password" required placeholder="Vaša lozinka"></b-form-input>
        </b-form-group>

        <b-button class="w-100" type="submit" variant="primary">
            <i class="fa fa-sign-in" aria-hidden="true"></i>
            Prijavi se
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "AdminLogin",
  components: {},
  mounted() {
    if(localStorage.getItem("ac_t") != undefined) {
      this.$router.push("/admin")
    }
  },
  data() {
      return {
        form: {
          email: '',
          name: '',
          food: null,
          checked: []
        }
      }
  },
  methods: {

    loginAdmin() {

      let loggingIn = this.$swal.fire({
            toast: true,
            position: 'top-end',
            title: this.$t('notifications.logging_in'),
            onBeforeOpen: () => {
                this.$swal.showLoading();
            }
        });

        let formData = new FormData();
        formData.append('email', this.form.email)
        formData.append('password', this.form.password)

        axios.post('/login', formData).then(response => {
            console.log(response)
            if(response.data.flag == false) {

                this.$swal.fire({
                    toast: false,
                    position: 'center',
                    icon: 'warning',
                    title: this.$t('notifications.confirm_account_first'),
                    showConfirmButton: true,
                });
                return;

            }

            loggingIn.close();
            this.$swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: this.$t('notifications.login_success') + "!",
                showConfirmButton: false,
                timer: 3500
            })

            localStorage.setItem("ac_t", response.data.access_token)
            location.reload();

        }).catch(() => {
            this.$swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: this.$t('notifications.login_error'),
                showConfirmButton: false,
                timer: 3500
            })
        });

    }

  }
};
</script>

<style scoped>

@media(min-width: 992px) {

    form {
        max-width: 30%;
        margin: 0 auto;
    }

}

</style>
