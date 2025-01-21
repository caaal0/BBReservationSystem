<script setup>
import UpperFloorSeats from '@/components/UpperFloorSeats.vue';
import { ref } from 'vue';
import SeatCalendar from '@/components/SeatCalendar.vue';

const seatActive = ref(false);
const selectedSeat = ref(null);
const showHint = ref(true);

function selectSeat(seat) {
  const seatNumber = seat;
  selectedSeat.value = seatNumber;
  // alert(`Seat ${seatNumber} selected`);
  seatActive.value = true;
}

onMounted( async () => {
  setTimeout(() => {
    showHint.value = false;
  }, 5000);
})

</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col class="text-center">
        <v-row justify="center" md="6" xs="12">
          <h1 :style="{padding: '10px'}">
            4th floor
          </h1>
          <svg width="225px" height="90px" viewBox="0 0 225 50">
            <rect x="25" y="20" width="15" height="15" fill="green" stroke="black" stroke-width="1"/>
            <text x="45" y="35" font-family="Verdana" font-size="12" fill="black">Available</text>
            <rect x="125" y="20" width="15" height="15" fill="red" stroke="black" stroke-width="1"/>
            <text x="145" y="35" font-family="Verdana" font-size="12" fill="black">Occupied</text>
          </svg>
          <v-tooltip activator="parent" v-model="showHint" location="bottom">
            Select a seat to reserve
          </v-tooltip>
        </v-row>
        <upper-floor-seats @seat-selected="selectSeat"/>
        <v-dialog v-model="seatActive" width="1000">
          <SeatCalendar :selectedSeat="selectedSeat" @close="seatActive = false"/>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
