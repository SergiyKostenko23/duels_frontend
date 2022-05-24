<template>
    <div>
        <div v-if="numItems > 0">
            <div v-if="this.playing">
                <div v-if="this.isVid">
                    <div class="overlay">{{this.iteration}}/{{Math.round(this.iterations)}}</div>
                    <img class="overlay2" :src="`${publicPath}vs.png`">
                    <div class="column" @click="chooseItems(i+1, i)" :style='{ backgroundImage: `url(${this.items[i].url})` }'>
                            <p>{{this.items[i].nome}}</p>
                    </div>
                    <div class="column" @click="chooseItems(i, i+1)" :style='{ backgroundImage: `url(${this.items[i+1].url})` }'>
                            <p>{{this.items[i+1].nome}}</p>
                    </div>
                </div>
                <div v-else>
                    <div class="overlay">{{this.iteration}}/{{Math.round(this.iterations)}}</div>
                    <img class="overlay2" :src="`${publicPath}vs.png`">
                    <div class="column" @click="chooseItems(i+1, i)">
                        <iframe width="100%" style="z-index: 5; position: relative; border: 0; padding: 20px; height: 75%;" :src="this.items[i].url"></iframe>
                        <p>{{this.items[i].nome}}</p>
                    </div>
                    <div class="column" @click="chooseItems(i, i+1)">
                        <iframe width="100%" style="z-index: 5; position: relative; border: 0; padding: 20px; height: 75%" :src="this.items[i+1].url"></iframe>
                        <p>{{this.items[i+1].nome}}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <table>
                    <thead>
                        <tr>
                            <th>Lugar</th>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>Popularidade</th>
                        </tr>
                    </thead>
                    <tbody v-for="(res, index) in result" v-bind:key="res.id">
                        <tr>
                            <td>{{index+1}}º</td>
                            <td><img v-bind:src="res.url" width="100%" max-height="100%"></td>
                            <td>{{res.nome}}</td>
                            <td>{{res.popularidade}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else>
            Não é possível completar um duel sem este ter ítens.
            <router-link :to="{name: 'items', params: {slug: this.duels[0].slug}}">Adicionar ítens</router-link>
        </div>
    </div>
</template>

<script>
export default {
    props: ['slug'],
    name:"doduels",
    data() {
        return {
            publicPath: process.env.BASE_URL,
            duels: [{slug: "null"}],
            items: [{url: "null", nome: null},{url: null, nome: null}],
            items2: [],
            progress: false,
            progressId: 0,
            i: 0,
            result: [],
            playing: true,
            iteration: 1,
            iterations: 0,
            data: null,
            isVid: false,
            numItems: 0,
        }
    },
    methods: {
        getDuels() {
            this.data = new Date()
            const config = {
                method: 'get',
                url: '/api/duel?slug='+this.slug,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
                }
            }
            this.axios(config).then(response => {
                this.duels = response.data
            }).then(() => {
                this.getItems()
                this.Progress('GET')
            }).catch(error => {
                console.log(error)
            })
        },
        getItems() {
            const config = {
                method: 'get',
                url: '/api/item?duel='+this.duels[0].id,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
            }
            }
            this.axios(config).then(response => {
                this.items = response.data
            }).then(() => {
                this.randomify(this.items)
                this.countIterations()
                this.checkVid()
                this.countItems()
                this.$forceUpdate()
            }).catch(error => {
                console.log(error)
            })
        },
        getItemsNum() {
            const self = this
            var count =0
            for(var i in self.items)
                count++
            return count
        },
        randomify(items) {
            const self = this
            var i, j, k;
            for (i = items.length -1; i > 0; i--) {
                j = Math.floor(Math.random() * i)
                k = items[i]
                items[i] = items[j]
                items[j] = k
            }
        },
        chooseItems(escolha, nao_escolha) {
            const self = this
            self.items[nao_escolha].popularidade++
            self.items2.push(self.items[escolha])
            self.items.splice(escolha, 1)
            self.i++
            self.iteration++
            if((typeof self.items[self.i+1] === 'undefined'))
            {
                if(self.items.length > 1)
                {
                    self.i = 0
                    self.randomify(self.items)
                    if(self.items.length & 1)
                    {
                        self.randomify(self.items2)
                        self.items.push(self.items2[0])
                        self.items2.splice(0, 1)
                    }
                }
                else
                {
                    self.i = 0
                    if(self.items.length == 1)
                    {
                        self.items2.push(self.items[self.i])
                        self.items.splice(self.i, 1)
                        self.reverseArray(self.items2)
                        self.addResults()
                        self.playing = false
                    }
                }
            }
            if(self.progress == true)
                self.Progress("PUT")
            else
                self.Progress("POST")
        },
        addResults() {
            var d = new Date()
            var r = []
            for(var j in this.result)
                r[j] = this.result[j].id
            var re = r.toString()
            const config = {
                method: 'post',
                url: '/api/result',
                data: {
                    users: window.localStorage.getItem('id'),
                    duels: this.duels[0].id,
                    result: re,
                    inicio: this.data,
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).then(() => {
                this.addPop()
                this.Progress("DELETE")
            }).catch(error => {
                console.log(error)
            })
        },
        addPop() {
            var dat = []
            for(var j in this.result)
            {
                dat[j]={
                    id: this.result[j].id,
                    popularidade: this.result[j].popularidade,
                }
            }
            const config = {
                method: 'put',
                url: '/api/item',
                data: dat,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'dataType': "json",
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).then(() => {
                this.setDone()
            }).catch(error => {
                console.log(error)
            })
        },
        countIterations() {
            if(this.items.length>1)
            {
                var num = this.getItemsNum()
                if(!(num%2===0))
                    this.iterations--
                for(num; num>1; )
                {
                    if(!Number.isInteger(num))
                        this.iterations++
                    num = num/2
                    this.iterations += num
                }
            }
        },
        setDone() {
            const config = {
                method: 'put',
                url: '/api/duel?slug='+this.slug,
                data: {
                    id: this.duels[0].id,
                    feito: ++this.duels[0].feito,
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).catch(error => {
                console.log(error)
            })
        },
        reverseArray(inputArray) {
            const self = this
            for (var j = inputArray.length - 1; j >= 0; j--)
                self.result.push(inputArray[j])
        },
        Progress(method) {
            switch(method) {
                case 'DELETE':
                    var config = {
                        method: 'DELETE',
                        url: '/api/progress',
                        data: {
                            id: this.progressId,
                        },
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRFToken': $cookies.get('csrftoken'),
                            'Accept-Language': 'pt-br',
                            'Authorization': 'token ' + window.localStorage.getItem('token')
                        }
                    }
                    this.axios(config).catch(error => {
                        console.log(error)
                    })
                break
                case 'PUT':
                    var r = []
                    for(var j in this.items)
                        r[j] = this.items[j].id
                    var ch = r.toString()
                    var t = []
                    for(var j in this.items2)
                        t[j] = this.items2[j].id
                    var nc = t.toString()
                    config = {
                        method: 'PUT',
                        url: '/api/progress',
                        data: {
                            id: this.progressId,
                            chosen: ch,
                            not_chosen: nc,
                            iteration: this.iteration
                        },
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRFToken': $cookies.get('csrftoken'),
                            'Accept-Language': 'pt-br',
                            'Authorization': 'token ' + window.localStorage.getItem('token')
                        }
                    }
                    this.axios(config).catch(error => {
                        console.log(error)
                    })
                break
                case 'GET':
                    config = {
                        method: 'GET',
                        url: '/api/progress?duel='+this.duels[0].id,
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRFToken': $cookies.get('csrftoken'),
                            'Accept-Language': 'pt-br',
                            'Authorization': 'token ' + window.localStorage.getItem('token')
                        }
                    }
                    this.axios(config).then(response => {
                        if(response.data[0] != undefined) {
                            this.items = response.data[0].chosen
                            this.items2 = response.data[0].not_chosen
                            this.progress = true
                            this.progressId = response.data[0].id
                            this.iteration = response.data[0].iteration
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                break
                case 'POST':
                    var r = []
                    for(var j in this.items)
                        r[j] = this.items[j].id
                    var ch = r.toString()
                    var t = []
                    for(var j in this.items2)
                        t[j] = this.items2[j].id
                    var nc = t.toString()
                    config = {
                        method: 'POST',
                        url: '/api/progress',
                        data: {
                            user: window.localStorage.getItem('id'),
                            duel: this.duels[0].id,
                            chosen: ch,
                            not_chosen: nc,
                            iteration: this.iteration
                        },
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRFToken': $cookies.get('csrftoken'),
                            'Accept-Language': 'pt-br',
                            'Authorization': 'token ' + window.localStorage.getItem('token')
                        }
                    }
                    this.axios(config).then(response => {
                        this.progress = true
                        this.progressId = response.data.id
                    }).catch(error => {
                        console.log(error)
                    })
                break
            }
        },
        checkVid() {
            if(this.items[0].url.includes("youtu"))
                this.isVid = false
            else
                this.isVid = true
        },
        countItems() {
            this.numItems = this.items.length
        }
    },
    mounted() {
        this.getDuels()
    }
}
</script>

<style lang="scss" scoped>
p {
    color: white;
    font-size: 25px;
    bottom: 0;
    text-shadow: 2px 2px #333;
}
.column {
    position: relative;
    float: left;
    width: 50%;
    height: calc(100vh - 52px);
    background-position: center center;
    background-size: cover;
    background-color: rgba(126, 122, 122, 0.867);
    z-index: -1;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: inherit;
        //background-color: rgba(0, 0, 0, 0.6);
        background-color: rgba(10,72,112, 0);
        transition: all 0.8s;
    }
    &:hover:before {
        background-color: rgba(10,72,112, 0.4);
        cursor: pointer;

    }
    
}

.overlay {
    position: absolute;
    color: white;
    text-shadow: 2px 2px #333;
    font-size: 80px;
    z-index: 2;
    width: 200px;
    left: 0;
    right: 0;
    margin: 0 auto;
    cursor: default;
}
.overlay2 {
    height: 150px; 
    position: absolute;
    z-index: 2;
    top: 40%;
    right: 0;
    left: 0;
    margin: 0 auto;
    transform: rotate(-35deg);
    
}
img {
    max-width: 100px;
}

@media only screen and (max-width: 600px) {
.column {
    width: 100%;
    display: inline-block;
    clear: both;
    height: calc(54vh - 52px);
    &:before {
        background-color: unset;
        animation: none;
    }
    &:hover:before {
        background-color: unset;
    }
}
.overlay2 {
    top: 45%;
    left: 70%;
    height: 130px;
    transform: none;
}
.overlay {
    top: 48%;
    font-size: 50px;
    right: 80%;
    width: 60px;
}
iframe {
    position: absolute;
    height: 100%;
    width: 100%;
}
}
</style>