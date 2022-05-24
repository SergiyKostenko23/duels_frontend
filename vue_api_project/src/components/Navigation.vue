<template>
    <div class="topnav" id="navigation">
        <ul>
          <li>
            <router-link to="/">Início</router-link>
            <router-link class="n" to="/duels">Duelos</router-link>
            <!--router-link class="n" to="/game">Jogo</router-link-->
          </li>
          
          <li v-if="!checkLogin()" class="right">
            <router-link class="n" to="/myduels">Meus Duelos</router-link>
            <div class="dropdown n">
              <a href="javascript:void(0)" class="dropbtn">{{getCurrentUser}} &#9662;</a>
              <div class="dropdown-content">
                <router-link to="/profile">Perfil</router-link>
                <router-link to="/results">Resultados</router-link>
                <a @click="Logout()" href="">Logout</a>
              </div>
            </div>
          </li >

          <li v-if="checkLogin()" class="right">
            <router-link to="/login">Login</router-link>
            <router-link to="/registar">Registar</router-link>
          </li>
  
          <li href="javascript:void(0);" class="icon" @click="open()">
            <i class="fa fa-bars"></i>
          </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: "navigation",
  computed: {
    getCurrentUser() {
      return window.localStorage.getItem('user')
    }
  },
  methods: {
    checkLogin() {
      if(window.localStorage.getItem('token')==null)
        return true
      else
        return false
    },
    Logout() {
      window.localStorage.clear()
    },
    open() {
      var x = document.getElementById("navigation")
      if (x.className === "topnav") {
        x.className += " responsive"
      } else {
        x.className = "topnav"
      }
    },
  }
}
</script>

<style scoped>
.topnav {
  top: 0;
  width: 100%;
  position: fixed;
  z-index: 100;
  height: 55px;
}
ul {
  list-style-type: none;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
  float: left;
  display: inline-flex;
}

li a:last-child {
  border-right: none;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  border-right:1px solid #bbb;
}

li a:hover:not(.active) {
  background-color: #0366ee;
  color: white;
}

.active {
  background-color: #0366ee;
}
li a, .dropbtn {
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li.right {
   float:right;
}

.dropdown-content {
  color: white;
  display: none;
  position: absolute;
  background-color: #333;
  box-shadow: 0px 8px 16px 0px #0366ee;
  z-index: 100;
  right: 0;
}

.dropdown-content a {
  border-top:1px solid #bbb;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.router-link-exact-active{
  background-color: #0366ee;
}
.topnav .icon {
  display: none;
  color: white;
  padding: 14px 16px;
}

@media screen and (max-width: 600px) {
  .topnav .n {display: none;}
  .topnav li.icon {
    float: right;
    display: block;
  }
  .topnav.responsive .n {
    display:block; border-top: 1px solid #bbb;
  }
}
@media screen and (max-width: 600px) {
  .topnav.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .topnav.responsive li {
    float: none;
    display: block;
    text-align: left;
  }
  .topnav.responsive .dropdown-content {
    float: none;
    width: 100%;
  }
}
</style>