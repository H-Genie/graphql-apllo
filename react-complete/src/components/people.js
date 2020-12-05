import './components.css';
import { useState } from 'react';
import { useQuery, userMutation, gql } from '@apollo/client';

const GET_PEOPLE = gql`
  query GetPeople {
  people {
    id,
    first_name,
    last_name,
    sex,
    blood_type
  }
  }
`;

function People() {
  const [contentId, setContentId] = useState(0)

  const bloodTypes = ['A', 'B', 'AB', 'O']
  const roles = ['developer', 'designer', 'planner']

  function AsideItems () {
    const { loading, error, data } = useQuery(GET_PEOPLE);
    function peopleFaces(sex) {
      const bySex = {
        male: ['🧑🏿', '👨🏻', '👦🏼', '‍🧓🏽', '🧔🏾'],
        female: ['👩🏻', '👧🏼', '👩🏽‍🦰', '👩🏾‍🦱', '👱🏿‍♀️']
      }
      return bySex[sex][Math.floor(Math.random() * bySex[sex].length)]
    }

    if (loading) return <p className="loading">Loading...</p>
    if (error) return <p className="error">Error :(</p>

    return (
      <ul>
        {data.people.map(
          ({id, sex, first_name, last_name, blood_type}) => {
            return (
              <li key={id}>
                <span className="face">{peopleFaces(sex)}</span>
                <span className="bloodType">{blood_type}</span>
                <span className="peopleName">{first_name} {last_name}</span>
              </li>
            )
        })}
      </ul>
    );
  }

  function MainContents () {
    return (
      <div className="inputContainer">
        <table>
          <tbody>
            {contentId !== 0 && (
            <tr>
              <td>Id</td>
              <td>{contentId}</td>
            </tr>
            )}
            <tr>
              <td>First Name</td>
              <td>
                  <input type="text"/>
              </td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>
                  <input type="text"/>
              </td>
            </tr>
            <tr>
              <td>Sex</td>
              <td>
                  <input type="text"/>
              </td>
            </tr>
            <tr>
              <td>Blood Type</td>
              <td>
                <select>
                  {bloodTypes.map((bloodType) => {
                    return (
                      <option>{bloodType}</option>                    
                    )
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Serve Years</td>
              <td>
                  <input type="number"/>
              </td>
            </tr>
            <tr>
              <td>Role</td>
              <td>
                <select>
                  {roles.map((bloodType) => {
                    return (
                      <option>{bloodType}</option>                    
                    )
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Team</td>
              <td>
                  <input type="number"/>
              </td>
            </tr>
            <tr>
              <td>From</td>
              <td>
                  <input type="text"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div id="people" className="component">
      <aside>
        {AsideItems()}
      </aside>
      <section className="contents">
        {MainContents()}
      </section>
    </div>
  )
}

export default People;