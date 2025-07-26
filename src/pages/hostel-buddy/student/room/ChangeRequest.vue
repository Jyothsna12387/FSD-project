 <template>
  <div class="room-change-container">
    <h1 class="title">Room Change Request</h1>
    <div class="form-status-wrapper">
      
      <!-- Left: Form -->
      <div class="form-section">
        <div class="current-room-card">
          <h2>Your Current Room</h2>
          <p><strong>Room Number : </strong> {{ currentRoom }}</p>
          <p><strong>Block : </strong> {{ currentBlock }}</p>
        </div>

        <form @submit.prevent="submitRequest" class="change-form">
          <div class="form-group">
            <label>Preferred Block</label>
            <select v-model="form.preferredBlock">
              <option disabled value="">Select Block</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

          <div class="form-group">
            <label>Preferred Room Number</label>
            <input v-model="form.preferredRoomNumber" placeholder="e.g. B-305" />
          </div>

          <div class="form-group">
            <label>Reason for Change</label>
            <textarea v-model="form.reason" placeholder="Please explain your reason..."></textarea>
          </div>

          <button type="submit" class="submit-button">Submit Request</button>
          <button type="button" class="history-button" @click="showHistory = true">View History</button>
        </form>
      </div>

      <!-- Right: Status Tracker -->
 <!-- Right: Status Tracker -->
<ul class="status-tracker">
  <!-- Step 1: Requested -->
  <li :class="{ active: true }">
    <span class="circle">1</span>
    <div>
      <strong>Requested</strong>
      <p>Request submitted for review</p>
    </div>
    <div class="line-down"></div>
  </li>

  <!-- Step 2: Approved (only if status is Approved) -->
  <li v-if="latestStatus === 'Approved'" class="active">
    <span class="circle">2</span>
    <div>
      <strong>Approved</strong>
      <p>Request approved by warden</p>
    </div>
  </li>

  <!-- Step 2: Rejected (only if status is Rejected) -->
  <li v-if="latestStatus === 'Rejected'" class="active">
    <span class="circle">2</span>
    <div>
      <strong>Rejected</strong>
      <p>Request rejected by warden</p>
    </div>
  </li>

  <!-- Step 2: Pending -->
  <li v-if="latestStatus === 'Pending'" class="active">
    <span class="circle">2</span>
    <div>
      <strong>Pending</strong>
      <p>Waiting for warden response</p>
    </div>
  </li>
</ul>

    </div>

 <!-- History Modal -->
<div v-if="showHistory" class="modal-overlay">
  <div class="modal-box">
    <h2>Your Request History</h2>

    <div v-if="history.length > 0" class="history-stack">
      <div
        v-for="(req, index) in history"
        :key="index"
        class="history-card"
        :class="{
          'pending-border': req.status === 'Pending',
          'approved-border': req.status === 'Approved',
          'rejected-border': req.status === 'Rejected'
        }">
        <div class="card-header">
          <span class="block-label">Block:</span>
          <span>{{ req.preferredBlock }} - {{ req.preferredRoomNumber }}</span>
        </div>
        <div class="card-body">
          <p><strong>Reason:</strong> {{ req.reason }}</p>
          <p>
            <strong>Status:</strong>
            <span :class="req.status.toLowerCase()">{{ req.status }}</span>
          </p>
          <p><strong>Requested On:</strong> {{ new Date(req.createdAt).toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-requests-message">No history available.</div>

    <button class="close-modal" @click="showHistory = false">Close</button>
  </div>
</div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        preferredBlock: '',
        preferredRoomNumber: '',
        reason: ''
      },
      currentRoom: '',
      currentBlock: '',
      latestStatus: '',
      history: [],
      showHistory: false
    };
  },
  mounted() {
    this.fetchCurrentRoom();
    this.fetchRequestHistory();
  },
  methods: {
     async submitRequest() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated. Please log in.');
      return;
    }

    const response = await axios.post(
      'api/v1/room-change',
      {
        preferredBlock: this.form.preferredBlock,
        preferredRoomNumber: this.form.preferredRoomNumber,
        reason: this.form.reason
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    alert('Request submitted successfully!');
     await this.fetchRequestHistory(); // optional: refresh latest request after submit
  } catch (error) {
    console.error('Error submitting request:', error);
    alert('Error submitting request.');
  }
},
    async fetchCurrentRoom() {
      try {
        const res = await axios.get('/api/v1/users/me'); // or your actual user info route
        this.currentRoom = res.data.user.roomNumber;
        this.currentBlock = res.data.user.block;
      } catch (err) {
        console.error('Error fetching user data');
      }
    },
    async fetchRequestHistory() {
  try {
    const res = await axios.get('/api/v1/room-change/my-requests');
    
    // Sort by most recent createdAt first
    const sortedHistory = res.data.requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    this.history = sortedHistory;

    // Find the most recent request (by createdAt) and set its status
    const latestRequest = sortedHistory.length > 0 ? sortedHistory[0] : null;
    this.latestStatus = latestRequest ? latestRequest.status : '';
  } catch (err) {
    console.error('Error fetching history');
  }
}


  }
};
</script>

 <style scoped>
.room-change-container {
  padding: 2rem;
}
.title {
  text-align: center;
  color: #00b894;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  border-bottom: 3px solid #00b894;
  padding-bottom: 0.5rem;
  width: 700px;
  margin-left: auto;
  margin-right: auto;
}
.form-status-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  max-width: 1000px;
}

/* Form */
.form-section {
  flex: 1;
  padding: 1rem;
  margin-left: 100px;
  width: 600px;
  /* margin-right: 80px; */
}
.current-room-card {
  background-color: #fafafa;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px #eee;
}

.current-room-card h2{
text-align: center;
color:#1BBC9B;
margin-bottom: 20px;
}

.change-form .form-group {
  margin-bottom: 1rem;
}
.change-form input,
.change-form select,
.change-form textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.submit-button{
font-size: 18px;
margin-left: 30px;
margin-right: 20px;
}

.submit-button,
.history-button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #00b894;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 0.5rem;
}
.history-button {
  background-color: #0984e3;
  font-size: 16px;
  margin-left: 240px;
  height:40px;
}
 
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
.modal-box h2 {
  font-size: 1.8rem;
  color: #00b894;
  font-weight: 600;
  padding-bottom: 0.5rem;
  /* border-bottom: 3px solid #00b894; */
  margin-bottom: 3rem;
  text-align: center;
}

.close-modal {
  margin-top: 1rem;
  background-color: #d63031;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  float: right;
  font-size: 16px;
}

.no-requests-message {
  color: #888;
  font-style: italic;
  text-align: center;
  margin-top: 1rem;
  font-size: 18px;
}

.history-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-card {
  background-color: #fdfdfd;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.card-header {
  font-size: 1rem;
  font-weight: 600;
  color: #00b894;
  margin-bottom: 0.5rem;
}

.card-body p {
  margin: 0.3rem 0;
  font-size: 0.95rem;
}
 
 /* Status-based left borders for history cards */
.pending-border {
  border-left: 6px solid #f1c40f;
}
.approved-border {
  border-left: 6px solid #2ecc71;
}
.rejected-border {
  border-left: 6px solid #e74c3c;
}

 .status-container {
  width: 300px;
  margin-left: 90px;
  margin-right: 0;
}

.status-tracker {
  list-style: none;
  padding-left: 0;
  margin-top: 20px;
  position: relative;
}

.status-tracker li {
  position: relative;
  padding-left: 30px;
  margin-bottom: 30px;
}

.status-tracker li .circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ccc;
  color: #fff;
  text-align: center;
  line-height: 24px;
  font-weight: bold;
}

.status-tracker li.active .circle {
  background-color: #00b894;
}

.status-tracker li.active strong {
  color: #00b894;
}

.line-down {
  position: absolute;
  top: 26px;
  left: 11px;
  width: 2px;
  height: 30px;
  background-color: #00b894;
}

</style>
