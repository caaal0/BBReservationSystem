<script setup>
import { useAuthStore } from '../stores/auth.js';
import { onMounted, ref } from 'vue';

const props = defineProps({
  selectedSeat: String,
});
//TODO: ILAGAY MO NA LANG SA ISANG DIALOG CALENDAR THEN WHEN THEY CLICK THE + BUTTON, LALABAS ITONG BOOKING FORM

const snackBarMsg = ref('');
const snackBarSuccess = ref(true);
const showSnackbar = ref(false);

const bookingFormRef = ref(null);
const loading = ref(false);
//rules
const required = (value) => !!value || 'Required.';
const validDateFormat = (value) => {
  const date = new Date(value);
  const today = new Date(minDate.value);
  today.setHours(0, 0, 0, 0);
  return date instanceof Date && !isNaN(date) && (date >= today) || 'Invalid date.';
};

const selectedDate = ref(null);
const startTime = ref(null);
const tempStartTime = ref(null);
const timeMenu = ref(false);
const selectedOption = ref(null);


const currentTime = computed(() => {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  return `${hours}:${minutes}`;
});

const today = computed(() => {
  //use iso string to compare
  const selectedDay = new Date(selectedDate.value).toISOString()
  const today = new Date(minDate.value).toISOString()
  if(selectedDay == today){
    return true;
  }
  return false;
});

const minDate = computed (() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  var y = today.getFullYear();
  var m = today.getMonth()+1;
  var d = today.getDate();
  if(d < 10){
    d = '0'+d;
  }
  if(m < 10){
    m = '0'+m;
  }
  const day = `${y}/${m}/${d}`
  return day;
});

const maxDate = computed(() => {
  const today = new Date();
  // today.setHours(0, 0, 0, 0);
  if(authStore.userRole === 'customer'){
    today.setDate(today.getDate() + 14);
  }
  return today;
});


function updateTime() {
  startTime.value = tempStartTime.value;
  timeMenu.value = false;
}

async function submitInfo() {
  loading.value = true;
  if(await validateForm(bookingFormRef)){
    console.log('submitInfo');
    console.log('selected date: ', selectedDate.value);
    console.log('selected time: ', startTime.value);
  }else{
    snackBarMsg.value = 'Please fill out the form correctly';
    snackBarSuccess.value = false;
    showSnackbar.value = true;
  }
  loading.value = false;
}

async function validateForm(formRef) {
  const validity = ref(null);
  if (formRef.value) {
    validity.value = await formRef.value.validate()
  }else{
    return false
  }
  // console.log(validity.value)
  return validity.value.valid
}

</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col class="text-center" md="6" sm="8" xs="12" cols="12">
        <h1>Book Seat #</h1>
        <v-form ref="bookingFormRef" @submit.prevent="submitInfo">
          <v-date-input
            clearable
            label="Select a Date"
            v-model="selectedDate"
            :rules="[required, validDateFormat]"
            variant="outlined"
            color="green-darken-1"
            :min="minDate"
            max="maxDate"
          ></v-date-input>
          <v-text-field
          v-model="startTime"
          :active="timeMenu"
          :focus="timeMenu"
          :rules="[required]"
          variant="outlined"
          color="green-darken-1"
          label="Picker a time to start"
          prepend-icon="mdi-clock-time-four-outline"
        >
          <v-menu
            v-model="timeMenu"
            :close-on-content-click="false"
            activator="parent"
          >
          <v-card>
            <v-time-picker
              v-if="timeMenu"
              v-model="tempStartTime"
              color="green darken-1"
              full-width
              height="auto"
              width="auto"
              format="ampm"
              :min="today ? currentTime : '00:00'"
              :ampm-in-title='true'
            ></v-time-picker>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="timeMenu = false" color="red-darken-1">Cancel</v-btn>
              <v-btn text @click="updateTime" color="green-darken-1">OK</v-btn>
            </v-card-actions>
          </v-card>
          </v-menu>
        </v-text-field>
        <p>How many hours?</p>
        <v-radio-group v-model="selectedOption" column :rules="[required]" color="green-darken-1">
          <v-radio label="1 Hour" value="1"></v-radio>
          <v-radio label="3 Hours" value="3"></v-radio>
          <v-radio label="5 Hours" value="5"></v-radio>
        </v-radio-group>
        <v-row justify="center">
          <v-btn
          variant="outlined"
          :style="{margin: '10px'}"
          color="green-darken-1"
          rounded="false"
          >
            Go Back
          </v-btn>
          <v-btn
          type="submit"
          :style="{margin: '10px'}"
          color="green-darken-1"
          rounded="false"
          :loading="loading"
          >
            Submit
          </v-btn>
        </v-row>
        </v-form>
        <v-snackbar
          v-model="showSnackbar"
          :color="snackBarSuccess? 'green':'red'"
          timeout="3000"
        >{{ snackBarMsg }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>

</template>

<style>
h1 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--green-dark);
}

p {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--green-dark);
}
</style>
