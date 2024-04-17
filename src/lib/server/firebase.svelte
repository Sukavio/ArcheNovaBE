<script lang="ts">
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, set } from "firebase/database";

    const firebaseConfig = {
        apiKey: "AIzaSyAaxI6YduCuxMwsdro6Aq2poqpDEay9AE0",
        authDomain: "archenova-681bd.firebaseapp.com",
        projectId: "archenova-681bd",
        storageBucket: "archenova-681bd.appspot.com",
        messagingSenderId: "238249120914",
        appId: "1:238249120914:web:5f469dab927bac0b63c24b",
        measurementId: "G-7VFG48T3LX"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const docRef = ref(db, "monster/Monster1");
    set(docRef, {
        name: "Monster",
        nummer: 1
    });
</script>