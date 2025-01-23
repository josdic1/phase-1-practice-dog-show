document.addEventListener('DOMContentLoaded', () => {

// DOM vars
  const dogForm = document.getElementById('dog-form')
const tableBody = document.getElementById('table-body')

// dynamic vars
   let formData = {
      name: '',
      breed: '',
      sex: ''
   }

   let dogList = []
   let editedDog = {
      id: '',
      name: '',
      breed: '',
      sex: ''
   }
   let inEditMode = false;

   const clearForm = () => {
     const inputs = dogForm.getElementsByTagName('input')
      const { name, breed, sex,  } = inputs
      name.value = ''
      breed.value = ''
      sex.value = ''
      inEditMode = false
      }
   

// fetch dog data
async function fetchDogs() {
   try {
      const r = await fetch(`http://localhost:3000/dogs`)
      if(!r.ok) {
         throw new Error ('Very very bad response')
      }
      const data = await r.json()
      dogList = data
      renderTable(data)
   }catch(error){ console.error ('Bad news! ', error)}
}
fetchDogs()

// render dog table
const renderTable = (dogs) => {
   const dogTableHtml = dogs.map(dog => (
      `
      <tr id='${dog.id}'>
      <td id='name'>${dog.name}</td>
       <td id='breed'>${dog.breed}</td>
        <td id='sex'>${dog.sex}</td>
       <td>
       <button type='button' id='${dog.id}' class='editBtn'>Edit Dog</button></td>
      </tr>
      `
   ))
   tableBody.innerHTML = dogTableHtml.join('')
}

// text input event
dogForm.addEventListener('input', function () {
   const inputs = dogForm.getElementsByTagName('input')
   const { name, breed, sex } = inputs
   formData = {
      name: name.value,
      breed: breed.value,
      sex: sex.value
   }
})

// submit button event
dogForm.addEventListener('submit', function (e) {
   e.preventDefault()
   const inputs = dogForm.getElementsByTagName('input')
   const { name, breed, sex } = inputs
   let dogObj;

   if(inEditMode) {
      dogObj = {
       ...editedDog,
       name: name.value,
       breed: breed.value,
       sex: sex.value
      }
      updateDog(dogObj)
   } else {
      dogObj = {
         name: name.value,
         breed: breed.value,
         sex: sex.value
      }
      addDog(dogObj)
   }
   clearForm()
})

// edit button event
tableBody.addEventListener('click', function (e) {
   inEditMode = true
  const dogId = e.target.id
  const selDog = dogList.find(dog => String(dog.id) === dogId)
  const inputs = dogForm.getElementsByTagName('input')
  const { name, breed, sex } = inputs

name.value = selDog.name
breed.value = selDog.breed
sex.value = selDog.sex

editedDog = selDog
})

// add dog
async function addDog(dog) {
   try {
      const r = await fetch(`http://localhost:3000/dogs/`, {
         method: "POST",
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(dog)
      })
      if(!r.ok) {
         throw new Error ('Add error')
      }
     const data = await r.json()
     dogList = [...dogList, data]
     fetchDogs(dogList)
   }catch(error) {console.error('Add error: ', error)}
}

// update dog
async function updateDog(updatedDog) {
   try {
      const r = await fetch(`http://localhost:3000/dogs/${updatedDog.id}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(updatedDog)
      })
      if(!r.ok) {
         throw new Error ('Update error')
      }
      const data = await r.json()
      const updatedList = dogList.map(dog => String(dog.id) === String(data.id) ? data : dog)
      fetchDogs(updatedList)
 
   }catch(error) {console.error('Update error: ', error)}
}



 
})