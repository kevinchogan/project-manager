import { useState } from "react";
import { Link } from "react-router-dom";

import { useQuery, useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import { GET_DISCIPLINES } from '../utils/queries';

import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    discipline: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);
  const { data: disciplineData, loading: disciplineLoading, error: disciplineError } = useQuery(GET_DISCIPLINES);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="main-container">
      <div>
        <h3 className="form-header">Sign Up</h3>
        {data ? (
          <p>
            Success! You may now head <Link to="/">back to the homepage.</Link>
          </p>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <label htmlFor="username">Username: </label>
              <input
                className=""
                placeholder="Your username"
                name="username"
                type="text"
                value={formState.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email: </label>
              <input
                className=""
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password: </label>
              <input
                className=""
                placeholder="******"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="discipline">Discipline:</label>
              <select
                id="discipline"
                name="discipline"
                value={formState.discipline}
                onChange={handleChange}
                disabled={disciplineLoading}
              >
                {disciplineData && disciplineData.disciplines.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="button-row">
              <button className="" style={{ cursor: "pointer" }} type="submit">
                Submit
              </button>
            </div>
          </form>
        )}

        {error && <div className="">{error.message}</div>}
      </div>
    </main>
  );
};

export default Signup;
