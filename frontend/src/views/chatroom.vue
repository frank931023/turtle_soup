<template>
  <div class="wrapper">
    <div class="card mt-3">
      <div class="card-body">
        <div class="card-title">
          <h3>Chat Room</h3>
          <div v-if="isUserJoined" class="leave-container">
            <button type="button" @click="leaveRoom" class="btn btn-danger">Leave room</button>
          </div>
        </div>

        <!-- 選擇創建或加入房間 -->
        <div v-if="!selectedMode && !isUserJoined" class="room-selection">
          <h4>請選擇操作</h4>
          <div class="button-group">
            <button @click="selectMode('create')" class="btn btn-success">創建房間</button>
            <button @click="selectMode('join')" class="btn btn-primary">加入房間</button>
          </div>
        </div>

        <!-- 創建房間表單 -->
        <div v-if="selectedMode === 'create' && !isUserJoined" class="join-form">
          <button @click="resetMode" class="btn btn-outline back-button">返回</button>
          <h4>創建房間</h4>
          <div class="room-code-display">
            <p>
              您的房間代碼: <b>{{ roomCode }}</b>
            </p>
            <p class="share-text">分享這個代碼給想加入的使用者</p>
          </div>
          <div class="name-input">
            <label for="user">使用者名稱:</label>
            <input type="text" v-model="user" class="form-control" placeholder="請輸入您的名稱" />
          </div>
          <button @click="createRoom" class="btn btn-success">創建並進入</button>
        </div>

        <!-- 加入房間表單 -->
        <div v-if="selectedMode === 'join' && !isUserJoined" class="join-form">
          <button @click="resetMode" class="btn btn-outline back-button">返回</button>
          <h4>加入房間</h4>
          <div class="room-input">
            <label for="roomCode">房間代碼:</label>
            <input
              type="text"
              v-model="roomCodeInput"
              class="form-control"
              placeholder="請輸入四位數房間代碼"
              maxlength="4"
              pattern="[0-9]{4}"
            />
          </div>
          <div class="name-input">
            <label for="user">使用者名稱:</label>
            <input type="text" v-model="user" class="form-control" placeholder="請輸入您的名稱" />
          </div>
          <button @click="joinRoom" class="btn btn-success">進入房間</button>
        </div>

        <!-- 顯示房間號碼 -->
        <div v-if="isUserJoined" class="room-code-display joined">
          <div class="room-info">
            <span
              >房間號碼: <b>{{ roomCode }}</b></span
            >
            <span class="user-name">使用者: {{ user }}</span>
          </div>
        </div>

        <!-- 聊天訊息 -->
        <div class="card-body message-body" v-if="isUserJoined && messages.length > 0">
          <div
            class="message-container"
            :class="msg.socket_id == socket.id && 'sender-msg'"
            v-for="(msg, index) in messages"
            :key="index"
          >
            <div class="messages">
              <p class="username">{{ msg.user }}</p>
              <p>{{ msg.message }}</p>
            </div>
          </div>
        </div>

        <div v-if="isUserJoined && messages.length === 0" class="empty-message">
          <p>還沒有任何訊息，開始聊天吧！</p>
        </div>
      </div>

      <div class="card-footer">
        <form v-if="isUserJoined" @submit.prevent="sendMessage">
          <div class="form-group msg-container">
            <input type="text" v-model="message" placeholder="Type Message" class="form-control" />
            <button type="submit" class="btn btn-success">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import io from 'socket.io-client'

// vue imports
import { ref } from 'vue'

const socket = ref(null)

const user = ref('')
const message = ref('')
const messages = ref([])
const isUserJoined = ref(false)
const selectedMode = ref('')
const roomCode = ref('')
const roomCodeInput = ref('')

// 選擇模式：創建或加入房間
const selectMode = (mode) => {
  selectedMode.value = mode

  // 如果選擇創建房間，生成一個4位數隨機碼
  if (mode === 'create') {
    roomCode.value = Math.floor(1000 + Math.random() * 9000).toString()
  }
}

// 重置模式選擇
const resetMode = () => {
  selectedMode.value = ''
  roomCodeInput.value = ''
}

// 創建房間
const createRoom = () => {
  if (!user.value.trim()) {
    alert('請輸入使用者名稱')
    return
  }

  // 連接到服務器並加入房間
  connectToServer()

  // 將房間代碼發送到服務器
  socket.value.emit('CREATE_ROOM', {
    roomCode: roomCode.value,
    user: user.value,
    socket_id: socket.value.id,
  })
}

// 加入房間
const joinRoom = () => {
  if (!user.value.trim()) {
    alert('請輸入使用者名稱')
    return
  }

  if (
    !roomCodeInput.value ||
    roomCodeInput.value.length !== 4 ||
    isNaN(Number(roomCodeInput.value))
  ) {
    alert('請輸入有效的四位數房間代碼')
    return
  }

  roomCode.value = roomCodeInput.value

  // 連接到服務器並加入房間
  connectToServer()

  // 將房間代碼發送到服務器
  socket.value.emit('JOIN_ROOM', {
    roomCode: roomCode.value,
    user: user.value,
    socket_id: socket.value.id,
  })
}

// 連接到 Socket.IO 服務器
const connectToServer = () => {
  socket.value = io('localhost:3000', { transports: ['websocket'] })

  // 監聽房間加入確認
  socket.value.on('ROOM_JOINED', (data) => {
    if (data.success) {
      isUserJoined.value = true
      // 如果服務器返回舊消息，加載它們
      if (data.messages && data.messages.length > 0) {
        messages.value = data.messages
      }
    } else {
      alert(data.message || '加入房間失敗')
    }
  })

  // 監聽新消息
  socket.value.on('MESSAGE', (data) => {
    if (data.roomCode === roomCode.value) {
      messages.value = [...messages.value, data]
    }
  })

  // 監聽錯誤
  socket.value.on('ERROR', (data) => {
    alert(data.message)
  })
}

const sendMessage = (e) => {
  e.preventDefault()
  if (!message.value.trim()) return

  socket.value.emit('SEND_MESSAGE', {
    user: user.value,
    message: message.value,
    socket_id: socket.value.id,
    roomCode: roomCode.value,
  })
  message.value = ''
}

const leaveRoom = () => {
  if (socket.value) {
    // 通知服務器用戶離開房間
    socket.value.emit('LEAVE_ROOM', {
      roomCode: roomCode.value,
      user: user.value,
    })

    socket.value.disconnect()
  }

  // 重置所有狀態
  user.value = ''
  message.value = ''
  messages.value = []
  isUserJoined.value = false
  selectedMode.value = ''
  roomCode.value = ''
  roomCodeInput.value = ''
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
.wrapper {
  background: #e8eaff;
  min-height: 100vh;
}

.card-title {
  margin-bottom: 30px;
  padding: 20px;
  background: #153f5e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leave-container {
  display: flex;
  justify-content: flex-end;
}

.message-body {
  padding: 20px;
  max-width: 700px;
  margin: auto;
  max-height: 60vh;
  overflow-y: scroll;
}

.card-title h3 {
  text-align: center;
  color: #fff;
  text-transform: uppercase;
}

/* 房間選擇與表單樣式 */
.room-selection,
.join-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  max-width: 500px;
  margin: 0 auto;
}

.join-form {
  position: relative;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #ccc;
  background: transparent;
  color: #153f5e;
}

.button-group {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.room-input,
.name-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.room-code-display {
  background: rgba(21, 63, 94, 0.1);
  padding: 15px 25px;
  border-radius: 8px;
  margin: 10px auto;
  text-align: center;
}

.room-code-display.joined {
  width: fit-content;
}

.room-info {
  display: flex;
  gap: 20px;
}

.share-text {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.user-name {
  font-weight: 500;
}

.empty-message {
  text-align: center;
  padding: 30px;
  color: #666;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.msg-container {
  width: 100%;
  position: fixed;
  bottom: 50px;
  flex-direction: row;
}

.form-group label {
  color: #153f5e;
  font-weight: bolder;
}

.form-group .input-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form-group input {
  height: 20px;
  max-width: 300px;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  color: #153f5e;
}

.form-group input:focus-visible {
  border: 2px solid #153f5e;
  outline: none;
}

.btn {
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 30px;
  border-radius: 50px;
}

.btn.btn-success {
  background: #35d87a;
}

.btn.btn-primary {
  background: #3498db;
}

.btn.btn-danger {
  background: #c5243f;
}

.btn.btn-outline {
  padding: 5px 15px;
}

.message-container {
  display: flex;
  justify-content: flex-start;
}

.messages {
  color: #153f5e;
  width: 200px;
  border-radius: 10px;
  padding: 0 10px 10px 10px;
  background: #fff;
  box-shadow: 2px 2px #d7d7d7;
  position: relative;
  margin-bottom: 20px;
}

.messages::after {
  border-width: 0px 20px 20px 0;
  border-color: transparent #fff transparent transparent;
  top: 0;
  left: -10px;
  position: absolute;
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
}

.messages .username {
  font-weight: bolder;
  padding-bottom: 10px;
}

.sender-msg {
  justify-content: flex-end;
}

.sender-msg .messages::after {
  left: auto;
  right: -10px;
  border-width: 0px 0px 20px 20px;
  border-color: #fff transparent transparent #fff;
}
</style>
