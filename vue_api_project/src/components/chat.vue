<template>
    <div class="chat-box">
        <div class="container" v-for="m in messages" v-bind:key="m.id" v-bind:class="[m.class ? 'darker' : '']">
            <img v-bind:src="m.photo" v-bind:class="[m.class ? 'me' : 'him']" alt="Avatar">
            <p v-bind:class="[!m.class ? 'me' : 'him']">{{m.message}}</p>
            <span v-bind:class="[m.class ? 'me' : 'him']" class="time">{{getDate(m.time)}}</span>
            <span v-bind:class="[!m.class ? 'me' : 'him']" class="name">{{m.user}}</span>
        </div>
        <input type="text" v-model="message" id="chat-message-input"><br>
        <button @click="sendSocket()">Send</button>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    name: "chat",
    data() {
        return {
            message: "",
            messages: [{message: "", class: false}],
            chatSocket: null,
        }
    },
    methods: {
        sendSocket() {
          this.chatSocket.send(JSON.stringify({
              'message': this.message,
              'user': window.localStorage.getItem('id'),
              'photo': window.localStorage.getItem('photo')
          }))
          this.message = ''
        },
      createSocket() {
        var self = this
        const roomName = "lobby"
        this.chatSocket = new WebSocket(
          'ws://'
          + 'localhost:8000'
          + '/ws/chat/'
          + roomName
          + '/'
        )
        this.chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data)
            //self.messages[self.messages.length] = data
            Vue.set(self.messages, self.messages.length, data)
            self.changeClass()
        }

        this.chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly')
        }
      },
      getMessages() {
        const config = {
            method: 'get',
            url: '/api/message',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'X-CSRFToken': $cookies.get('csrftoken'),
                'Accept-Language': 'pt-br',
            }
        }
        this.axios(config).then(response => {
            this.messages = response.data
            this.changeClass()
        }).catch((error) => {
            console.log(error)
        })
      },
      changeClass() {
          this.messages.forEach(element => {
                if(element.user_id == window.localStorage.getItem('id'))
                    element.class = true
          })
      },
      getDate(x) {
          var date = new Date(x)
          var hora = date.getHours()<10 ? "0" + date.getHours() : date.getHours()
          var min = date.getMinutes()<10 ? "0" + date.getMinutes() : date.getMinutes()
          return hora + ":" + min
      },
    },
    mounted() {
        this.createSocket()
        this.getMessages()
    },
}
</script>

<style scoped>
/* Chat containers */
.container {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}
.block{
    float: right;
}
/* Darker chat container */
.darker {
  border-color: #ccc;
  background-color: #ddd;
}

/* Clear floats */
.container::after {
  content: "";
  clear: both;
  display: table;
}
.container p{
  margin-right: 9px;
  margin-left: 9px;
}

/* Style images */
.container img {
  max-width: 60px;
  max-height: 60px;
  width: 100%;
  border-radius: 50%;
}
/* Style time text */
.time {
  color: #aaa;
  margin-right: 9px;
  margin-left: 9px;
}
.name {
  color: #aaa;
  margin-right: 9px;
  margin-left: 9px;
}
.him{
  float: left;
  clear: left;
}

.me{
  float: right;
  clear: right;
}
input{
    background-color: #FFF;
}
</style>