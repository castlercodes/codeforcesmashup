'use client';
import axios, { all } from 'axios';
import React, { useEffect, useState } from 'react';

function Page() {
  const [userIds, setUserIds] = useState(['']);
  const [ratingRequired, setRatingRequired] = useState('');
  let allProblems = [];
  let problems = [];
  const [problemName, setProblemName] = useState();

  useEffect(() => {

  }, [setRatingRequired])

  const getSolvedProblems = async (handle) => {
    try{
      const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
      const problemsData = response.data.result.map((problemdata) => problemdata.problem.name);
      problems = [...problems, ...problemsData]
    }
    catch(error){
      console.log(error);
    }
   }

   const getAllProblemsOfRating = async() => {
    try{
      const response = await axios.get(`https://codeforces.com/api/problemset.problems?rating=${ratingRequired}`);
      allProblems = response.data.result.problems;
    }
    catch(error){
      console.log(error);
    }
   }

   const getNotSolvedProblem = async() => {
    const unsolvedProblems = allProblems.filter((problem) => {
      return (
        !problems.includes(problem.name) &&
        problem.rating !== undefined &&
        problem.rating.toString() === ratingRequired
      );
    });
    const randomIndex = Math.floor(Math.random() * unsolvedProblems.length);
    setProblemName(unsolvedProblems[randomIndex]);
   }

   const handleSubmit = async () => {
    problems = [];
    await getAllProblemsOfRating();
    const getSolvedProblemsPromises = userIds.map(async(userId) => {
      return getSolvedProblems(userId)
    })
    await Promise.all(getSolvedProblemsPromises);
    await getNotSolvedProblem();
   }

  const handleInputChange = (e, index) => {
    const newIds = [...userIds];
    newIds[index] = e.target.value;
    setUserIds(newIds);
  };

  const handleAddUser = () => {
    setUserIds([...userIds, '']); // Add an empty string to create a new input field
    console.log(userIds);
  };

  const handleRemoveUser = (index) => {
    const newIds = [...userIds];
    newIds.splice(index, 1);
    setUserIds(newIds);
    console.log(userIds)
  };

  return (
    <div>
      <div>
        <div>Enter the Codeforces IDs of the people participating in the mashup</div>
        {userIds.map((id, index) => (
          <div key={index}>
            <input
              type="text"
              value={id}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Enter Codeforces ID"
            />
            {userIds.length > 1 && (
              <button onClick={() => handleRemoveUser(index)}>-</button>
            )}
          </div>
        ))}
        <button onClick={handleAddUser}>+</button>
        <div>
          <div>Collected User IDs:</div>
          <ul>
            {userIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        </div>
        <div>
          <div>Enter the problem rating that you want to find</div>
          <input placeholder='rating' onChange={(e) => {
            setRatingRequired(e.target.value);
          }}/>
        </div>

        <button onClick={handleSubmit}> Submit </button>
      </div>
        {problemName && (
        <div>
          <h2>Selected Problem</h2>
          <p>
            Contest ID: {problemName.contestId}
          </p>
          <p>
            Index: {problemName.index}
          </p>
          <p>
            Name: {problemName.name}
          </p>
          <p>
            Points: {problemName.points}
          </p>
          <p>
            Rating: {problemName.rating}
          </p>
          <p>
            Tags: {problemName.tags.join(', ')}
          </p>
          <p>
            Type: {problemName.type}
          </p>
        </div>
      )}
    </div>
  );
}

export default Page;
