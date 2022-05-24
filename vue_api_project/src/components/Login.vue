<template>
    <div id="login" class="small-container">
        <form @submit.prevent>
            <h2>Login</h2>
            <label>Email:</label>
            <input v-model="user.username" type="text"/>
            <label>Password:</label>
            <input v-model="user.password" type="password"/>
            <button @click="doLogin(user)">Login</button>
            <p v-if="hasError" class="error-message">
                ❗{{this.error}}
            </p>
        </form>
    </div>    
</template>

<script>
export default {
    name: "login",
    data() {
        return {
            user: {
                username: "",
                password: ""
            },
            hasError: false,
            error: undefined
        }
    },
    methods: {
        async doLogin(user) {
                const response = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
                    },
                })
                var data = await response.json()
                if(data.hasOwnProperty('token')) {
                    window.localStorage.setItem('token', data.token)
                    const response = await fetch('/api/profile', {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRFToken': $cookies.get('csrftoken'),
                            'Authorization': 'token ' + window.localStorage.getItem('token')
                        },
                    })
                    data = await response.json()
                    window.localStorage.setItem('id', data[0].id)
                    window.localStorage.setItem('user', data[0].user)
                    window.localStorage.setItem('nome', data[0].nome)
                    window.localStorage.setItem('email', data[0].email)
                    window.localStorage.setItem('photo', data[0].photo)
                    window.localStorage.setItem('data_registo', data[0].data_registo)
                    this.$router.replace({ name:'Home' })
                }
                else {
                    this.hasError = true
                    this.error = data
                }
        }
    }
}
</script>

<style scoped>
button {
    margin: 5px;
}
.error-message {
    color: #d33c40;
}
input {
    background-color: #FFF;
}
</style>