import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCwK8tY31uuCV2lfd6Uzab94OSIW16DUg0",
  authDomain: "my-first-project-d8914.firebaseapp.com",
  projectId: "my-first-project-d8914",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firebase function to add a task
function addTask() {
  const taskInput = document.getElementById("task-input");
  const task = taskInput.value.trim();

  if (task!== "") {
    db.collection("tasks").add({
      task: task,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    taskInput.value = "";
  }
}

// Function to render tasks
function renderTasks(doc) {
  const taskList = document.getElementById("task-list");
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";
  taskItem.innerHTML = `
    <span>${doc.data().task} </span>
    <button onclick="deleteTask('${doc.id}')">Delete</button>
  `;
  taskList.appendChild(taskItem);
}

// Listen for changes in the tasks collection and render tasks
db.collection("tasks")
.orderBy("timestamp", "desc")
.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        renderTasks(change.doc);
      }
    });
  });

// Function to delete a task
function deleteTask(id) {
  db.collection("tasks").doc(id).delete();
}