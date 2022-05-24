<template>
<div class="main">
    <div class="secondary">
        <img :src="getImg()" alt="Imagem de profile" class="profile-image">
    </div>
    <div class="secondary">
        <table>
            <thead>
                <tr>
                    <th>
                        Username: 
                    </th>
                    <th>
                            Nome: 
                    </th>
                    <th>
                            Data de registo: 
                    </th>
                    <th>
                            Email: 
                    </th>
                </tr>
            </thead>
            <tbody>
                <td>{{getUser()}}</td>
                <td>{{getNome()}}</td>
                <td>{{getData_registo()}}</td>
                <td>{{getEmail()}}</td>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
export default {
    name: "Profile",
    methods: {
        getImg() {
            return window.localStorage.getItem('photo')
        },
        getUser() {
            return window.localStorage.getItem('user')
        },
        getNome() {
            return window.localStorage.getItem('nome')
        },
        getEmail() {
            return window.localStorage.getItem('email')
        },
        getData_registo() {
            var d = new Date(window.localStorage.getItem('data_registo'))
            let dia = d.getDay()
            let mes = d.getMonth()
            let ano = d.getFullYear()
            let horas = d.getHours()
            return (dia+"/"+mes+"/"+ano+", "+horas+"h")
        },

    }

 
}
</script>

<style scoped>
.profile-image {
    object-fit: cover;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 2px solid #000000;
}   
.secondary {
    margin: 20px;
}
.main {
    display: flex;
    overflow-x: auto;
    flex-direction: column;
    align-items: center;
}
table {
  display: flex;
  align-items: center;
}
tr {
  flex-basis: 33.33333333%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 5px 10px;
 
  
}
th, td {
  flex-basis: 100%;
  text-align: left;
  display: flex;
  padding: 2px;
}

@media (max-width: 768px) {
  .main {
    display: block;
    overflow-x: auto;
  }
}
</style>