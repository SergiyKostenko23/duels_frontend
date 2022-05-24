<template>
    <div id="registar" class="small-container">
        <form @submit.prevent>
        <h2>Registo</h2>
        <label>Username:</label>
        <input class="text" v-model="user.user" type="text"/>
        <label>Nome:</label>
        <input class="text" v-model="user.nome" type="text"/>
        <label>Email:</label>
        <input class="text" v-model="user.email" type="text"/>
        <label>Password:</label>
        <input class="text" v-model="user.password" type="password"/>
        <label>Imagem:</label>
        <p><input id="file" type="file" ref="file" v-on:change="handleFileUpload()"/></p>
        <button @click="doRegister()">Registar</button>
        <p v-if="hasError" class="error-message">
            ❗{{this.error}}
        </p>
        </form>
    </div>    
</template>

<script>
export default {
    name: "registar",
    data() {
        return {
            user: {
                user: "",
                nome: "",
                email: "",
                password: "",
                photo: ""
            },
            file: "",
            hasError: false,
            error: undefined
        }
    },
    methods: {
        async handleFileUpload() {
            this.file = this.$refs.file.files[0]
        },
        async doRegister() {
            let formData = new FormData()
            formData.append('photo', this.file);
            formData.append('user', this.user.user);
            formData.append('nome', this.user.nome);
            formData.append('email', this.user.email);
            formData.append('password', this.user.password);
                const response = await fetch('/api/registar', {
                method: 'POST',
                body: formData,
                mimeType:'multipart/form-data',
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
                    },
                })
            const data = await response.json()
            if(data.hasOwnProperty('id')) {
                this.$router.replace({ name: 'Login' })
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
.error-message {
    color: #d33c40;
}
input.text {
    background-color: #FFF;
}
</style>