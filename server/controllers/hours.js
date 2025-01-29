import admin from 'firebase-admin';
import db from '../firebase.js';
import Firestore from '@google-cloud/firestore';

function formatDate(date) {
	const dateObj = new Date(date);
	const localTime = new Date(dateObj.getTime() + (8 * 60 * 60 * 1000)); // add 8 hours for UTC+8
	// const localTime = new Date(dateObj.getTime());
	const options = {
	  year: 'numeric',
	  month: 'short',
	  day: 'numeric',
	  hour: '2-digit',
	  minute: '2-digit',
	  hour12: true,
	};
  
	return localTime.toLocaleString('en-US', options);
  }

const getClosedHours = async (req, res) => {
    try{
        const closedHoursRef = db.collection('closedHours');
        const response = await closedHoursRef.get();
        let closedHoursArr = [];

        response.forEach(doc => {
            let startTime = formatDate(doc.data().startTime.toDate());
            let endTime = formatDate(doc.data().endTime.toDate());

            closedHoursArr.push(doc.data());

            let latestAdded = closedHoursArr.length - 1;

            closedHoursArr[latestAdded].startTime = startTime;
            closedHoursArr[latestAdded].endTime = endTime;
        });
        res.send(closedHoursArr);

    }catch (err){
        res.send({ success: false, msg: 'Unable to get closed hours', error: err.message });
    }
}

const addClosedHours = async (req, res) => {
    try{
        const closedHoursRef = db.collection('closedHours');
        const { startTime, endTime, addedBy } = req.body;

        //get the date of the start time as id
        let id = new Date(startTime).toISOString().slice(0,10)

        await closedHoursRef.doc(id).set({
            startTime: Firestore.Timestamp.fromDate(new Date(startTime)),
            endTime: Firestore.Timestamp.fromDate(new Date(endTime)),
            addedBy: addedBy,
        });

        res.send({ success: true, msg: 'Closed hours added successfully' });

    }catch (err){
        res.send({ success: false, msg: 'Unable to add closed hours', error: err.message });
    }
}

const deleteClosedHours = async (req, res) => {
    try{
        const closedHoursRef = db.collection('closedHours');
        const closedHoursID = req.params.closedHoursID;

        if(!closedHoursID) {
            throw new Error('Invalid closedHoursID');
        }

        const response = await closedHoursRef.doc(closedHoursID).delete();

        res.send({ success: true, msg: 'Closed hours deleted successfully', data: response });
    }catch (err){
        res.send({ success: false, msg: 'Unable to delete closed hours', error: err.message });
    }
}

export default {
    getClosedHours,
    addClosedHours
}