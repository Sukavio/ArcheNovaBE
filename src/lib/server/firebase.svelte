<script lang="ts">
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, set } from "firebase/database";

    const firebaseConfig = {
        apiKey: process.env.GOOGLE_API_KEY,
        authDomain: "archenova-681bd.firebaseapp.com",
        projectId: "archenova-681bd",
        storageBucket: "archenova-681bd.appspot.com",
        messagingSenderId: "238249120914",
        appId: process.env.APP_ID,
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