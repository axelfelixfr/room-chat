import { db } from "../firebase";

const created = async () => {
  //* Set
  //? Es posible insertar registros con set, indicando que es lo que queremos ingresar, le pasamos el objeto user
  //? Con "{ merge: true }" podemos mantener los datos de ese registro si es que ya existe
  //? Le inserta el ID al documento con doc()
  const user = { name: "Axel Félix", city: "México City", country: "México" };
  await db
    .collection("users")
    .doc("axelfelix")
    .set(user, { merge: true });

  //* Add
  //? Con add de igual forma registramos el user pero le delegamos la responsabilidad del ID a Firebase
  await db.collection("users").add(user);

  //* Get new ID and then add
  //? De igual forma podemos obtener un documento por su ID para después insertarlo
  const newDocRef = db.collection("users").doc();

  //? Obtenemos su id con "newDocRef.id"
  const newId = newDocRef.id;
  await newDocRef.set({ name: "Fer", created: Date.now(), id: newId });

  //* Update part of a document
  //? Podemos modificar un documento con el método update()
  const uniqueId = "Jvgwtfz3xnieaKTjsD4M"; //? Primero almacenamos su ID en una variable
  await db
    .collection("users")
    .doc(uniqueId)
    .update({ name: "Spiderman", age: 22 });
  //? Con el método doc() podemos acceder pasarle el ID para que lo identifique

  //* Deleting a document
  //? Eliminamos documento con el método sin argumentos delete()
  await db
    .collection("users")
    .doc(uniqueId)
    .delete();

  //* Read a document
  //? Leemos un documento con doc() y get()
  const document = await db
    .collection("users")
    .doc("axelfelix")
    .get();
  console.log(document.data()); //? Obtenemos la data del documento
  console.log(document.id); //? Obtenemos solo su ID
  console.log(document.exists); //? Podemos saber si existe el documento o no (devuelve valor boolean)

  //* Read all documents from a collection
  //? Se puede obtener todos los documentos de una colección con solo get()
  const collection = await db.collection("users").get();

  //? Iteramos cada uno de los documentos de la colección con forEeach
  collection.forEach(doc => console.log(doc.id, doc.data()));

  //* Read a document from a sub-collection
  //? Podemos hacer consultas a subcolecciones con solo poner la ruta
  const subDocument = await db
    .collection("users")
    .doc("axelfelix")
    .collection("hobbies")
    .doc("games")
    .get();
  console.log(subDocument.data());

  //* Read a document from a sub-collection (2)
  //? Para acortar la consulta, podemos ir recorriendo cada uno de los documentos y colecciones
  const subDocumentURL = await db.doc("users/axelfelix/hobbies/games").get();
  console.log(subDocumentURL.data());

  //* Listen for changes
  db.collection("users")
    .doc("axelfelix")
    .onSnapshot(docSnapshot => console.log(docSnapshot.data()));

  //* Listen for query changes
  db.collection("users")
    .where("name", "==", "Axel Félix")
    .onSnapshot(querySnapshot =>
      querySnapshot.forEach(docSnapshot => console.log(docSnapshot.id))
    );

  //* Listen for query changes
  //? Con el operador "==" estaremos pendientes de los registros con el name igual a "Fer"

  const unsubscribe = db
    .collection("users")
    .where("name", "==", "Fer")
    .onSnapshot(querySnapshot =>
      querySnapshot.docChanges().forEach(change => {
        //? El tipo added nos devolvera resultados cuando se agregue uno nuevo
        if (change.type === "added") {
          console.log("Added: ", change.doc.data());
        }

        //? El tipo modified nos devolvera resultados cuando se modifico
        if (change.type === "modified") {
          console.log("Modified: ", change.doc.data());
        }

        //? El tipo removed nos devolvera resultados cuando se remueve
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data());
        }
      })
    );

  //? Interrumpimos el escuchador almacenando la consulta en una const y llamandolo:
  unsubscribe();

  //* Query documents and collections
  //? Almacenamos la collección de users en una variable
  const collectionRef = db.collection("users");

  //? Consulta con el operador "=="
  const queryIgual = await collectionRef.where("name", "==", "Fer").get();
  queryIgual.forEach(querySnapshot => console.log(querySnapshot.data()));

  //? Consulta con el operador "!="
  const queryDiferente = await collectionRef
    .where("created", "!=", false)
    .get();
  queryDiferente.forEach(querySnapshot => console.log(querySnapshot.data()));

  //? Consulta con el operador "in"
  const queryIn = await collectionRef
    .where("name", "in", ["Axel Félix", "Fer"])
    .get();
  queryIn.forEach(querySnapshot => console.log(querySnapshot.data()));

  //? Consulta con el operador "array-contains-any"
  const queryArray = await collectionRef
    .where("movies", "array-contains-any", ["terror", "action"])
    .get();
  queryArray.forEach(querySnapshot => console.log(querySnapshot.data()));

  //* Order by and limit
  //? Consulta con limit()
  const queryLimit = await collectionRef
    .where("name", "==", "Fer")
    .limit(1)
    .get();
  queryLimit.forEach(querySnapshot => console.log(querySnapshot.data()));

  //? Consulta con orderBy()
  const queryOrderBy = await collectionRef.orderBy("name", "desc").get();
  queryOrderBy.forEach(querySnapshot => console.log(querySnapshot.data()));

  //? Consulta con where(), orderBy() y limit()
  const queryWhereLimit = await collectionRef
    .where("created", "<", Date.now())
    .orderBy("created", "desc")
    .limit(3)
    .get();
  queryWhereLimit.forEach(querySnapshot => console.log(querySnapshot.data()));

  //? Index
  const queryIndex = await collectionRef
    .where("name", "==", "Fer")
    .orderBy("created", "desc")
    .get();
  queryIndex.forEach(querySnapshot => console.log(querySnapshot.data()));
};

export default created;
