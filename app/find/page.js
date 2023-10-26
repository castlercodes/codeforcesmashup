import React, { Component } from 'react';
import axios from 'axios';

class UnsolvedProblemFinder extends Component {
  state = {
    userHandles: '',
    problemRating: '',
    unsolvedProblem: null,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  findUnsolvedProblem = async () => {
    const { userHandles, problemRating } = this.state;

    if (!userHandles || !problemRating) {
      alert('Please provide user handles and problem rating.');
      return;
    }

    try {
      const response = await axios.get(`https://codeforces.com/api/problemset.problems?apiKey=YOUR_API_KEY`);
      const problems = response.data.result.problems;
      const handles = userHandles.split(',').map((handle) => handle.trim());

      for (const problem of problems) {
        let problemSolved = false;

        for (const handle of handles) {
          const userSubmissions = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&apiKey=YOUR_API_KEY`);
          const userSolvedProblem = userSubmissions.data.result.find(
            (submission) => submission.problem.name === problem.name && submission.verdict === 'OK'
          );

          if (userSolvedProblem) {
            problemSolved = true;
            break;
          }
        }

        if (!problemSolved && problem.rating === +problemRating) {
          this.setState({ unsolvedProblem: problem });
          return;
        }
      }

      this.setState({ unsolvedProblem: null });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    const { userHandles, problemRating, unsolvedProblem } = this.state;

    return (
      <div>
        <h1>Unsolved Problem Finder</h1>
        <div>
          <label>User Handles (comma-separated):</label>
          <input
            type="text"
            name="userHandles"
            value={userHandles}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label>Problem Rating:</label>
          <input
            type="number"
            name="problemRating"
            value={problemRating}
            onChange={this.handleInputChange}
          />
        </div>
        <button onClick={this.findUnsolvedProblem}>Find Unsolved Problem</button>
        {unsolvedProblem && (
          <div>
            <h2>Unsolved Problem Found:</h2>
            <p>Name: {unsolvedProblem.name}</p>
            <p>Rating: {unsolvedProblem.rating}</p>
            <p>
              Problem Link:{' '}
              <a
                href={`https://codeforces.com/problemset/problem/${unsolvedProblem.contestId}/${unsolvedProblem.index}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Problem
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default UnsolvedProblemFinder;
