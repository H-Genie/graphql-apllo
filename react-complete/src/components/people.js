import './components.css';
import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PEOPLE = gql`
  query GetPeople {
  people {
    id
    first_name
    last_name
    sex
    blood_type
    }
  }
`;

const GET_PERSON = gql`
  query GetPeople($id: ID!) {
    person(id: $id) {
      id
      first_name
      last_name
      sex
      blood_type
      serve_years
      role
      team
      from
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`
const POST_PERSON = gql`
  mutation PostPerson($input: PostPersonInput!) {
    postPerson(input: $input) {
      id,
      first_name
      last_name
      sex
      blood_type
      serve_years
      role
      team
      from
    }
  }
`

const EDIT_PERSON = gql`
  mutation EditTeam($id: ID!, $input: PostPersonInput!) {
    editPerson(id: $id, input: $input) {
      id,
      first_name,
      last_name,
      sex,
      blood_type,
      serve_years,
      role,
      team,
      from
    }
  }
`

let refetchPeople = () => {}

function People() {
  const [contentId, setContentId] = useState(0)
  
  const sexes = ['male', 'female']
  const bloodTypes = ['A', 'B', 'AB', 'O']
  const roles = ['developer', 'designer', 'planner']

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [sex, setSex] = useState('')
  const [blood_type, setBloodType] = useState(bloodTypes[0])
  const [serve_years, setServeYears] = useState(0)
  const [role, setRole] = useState(roles[0])
  const [team, setTeam] = useState(0)
  const [from, setFrom] = useState('')

  const [postPerson] = useMutation(
    POST_PERSON, { onCompleted: postPersonCompleted })
  const [editPerson] = useMutation(
    EDIT_PERSON, { onCompleted: editPersonCompleted }) 
  const [deletePerson] = useMutation(
    DELETE_PERSON, { onCompleted: deletePersonCompleted }) 

  function execPostPerson () {
    postPerson({
      variables: {
        input: {
          first_name, last_name, sex, blood_type, serve_years, role, team, from
        }}})
  }
  function postPersonCompleted (data) {
    alert(`${data.postPerson.id} 항목이 생성되었습니다.`)
    refetchPeople()
    setContentId(0)
  }

  function execEditPerson () {
    editPerson({
      variables: {
        id: contentId,
        input: {
          first_name, last_name, sex, blood_type, serve_years, role, team, from
        }}})
  }
  function editPersonCompleted (data) {
    alert(`${data.editPerson.id} 항목이 수정되었습니다.`)
    refetchPeople()
  }

  function execDeletePerson () {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      deletePerson({variables: {id: contentId}})
    }
  }
  function deletePersonCompleted (data) {
    alert(`${data.deletePerson.id} 항목이 삭제되었습니다.`)
    refetchPeople()
    setContentId(0)
  }

  function AsideItems () {
    const { loading, error, data, refetch } = useQuery(GET_PEOPLE);

    refetchPeople = refetch

    function peopleFaces(sex, id) {
      const bySex = {
        male: ['🧑🏿', '👨🏻', '👦🏼', '‍🧓🏽', '🧔🏾'],
        female: ['👩🏻', '👧🏼', '👩🏽‍🦰', '👩🏾‍🦱', '👱🏿‍♀️']
      }
      return bySex[sex][id % bySex[sex].length]
    }

    if (loading) return <p className="loading">Loading...</p>
    if (error) return <p className="error">Error :(</p>

    return (
      <ul>
        {data.people.map(
          ({id, sex, first_name, last_name, blood_type}) => {
            return (
              <li key={id} onClick={() => {setContentId(id)}}>
                <span className="face">{peopleFaces(sex, id)}</span>
                <span className="bloodType">{blood_type}</span>
                <span className="peopleName">{first_name} {last_name}</span>
              </li>
            )
        })}
      </ul>
    );
  }

  function MainContents () {

    const { loading, error } = useQuery(GET_PERSON, {
      variables: {id: contentId},
      onCompleted: (data) => {
        if (contentId === 0) {
          setFirstName('')
          setLastName('')
          setSex('')
          setBloodType(bloodTypes[0])
          setServeYears(0)
          setRole(roles[0])
          setTeam(0)
          setFrom('')
        } else {
          setFirstName(data.person.first_name)
          setLastName(data.person.last_name)
          setSex(data.person.sex)
          setBloodType(data.person.blood_type)
          setServeYears(data.person.serve_years)
          setRole(data.person.role)
          setTeam(data.person.team)
          setFrom(data.person.from)
        }
      }
    });

    if (loading) return <p className="loading">Loading...</p>
    if (error) return <p className="error">Error :(</p>

    function handleChange(e, key) {
      const setters = {
          first_name: setFirstName,
          last_name: setLastName,
          sex: setSex,
          blood_type: setBloodType,
          serve_years: setServeYears,
          role: setRole,
          team: setTeam,
          from: setFrom
      }
      const numberType = ['serve_years']
      const value = numberType.includes(key) ? Number(e.target.value) : e.target.value
      setters[key](value)
    }

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
                <input type="text" value={first_name} onChange={(e) => {handleChange(e, 'first_name')}}/>
              </td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>
                <input type="text" value={last_name} onChange={(e) => {handleChange(e, 'last_name')}}/>
              </td>
            </tr>
            <tr>
              <td>Sex</td>
              <td>
                <select value={sex} onChange={(e) => {handleChange(e, 'sex')}}>
                  {sexes.map((sex) => {
                    return (
                      <option key={sex} value={sex}>{sex}</option>                    
                    )
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Blood Type</td>
              <td>
                <select value={blood_type} onChange={(e) => {handleChange(e, 'blood_type')}}>
                  {bloodTypes.map((bloodType) => {
                    return (
                      <option key={bloodType} value={bloodType}>{bloodType}</option>                    
                    )
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Serve Years</td>
              <td>
                  <input type="number" value={serve_years} onChange={(e) => {handleChange(e, 'serve_years')}}/>
              </td>
            </tr>
            <tr>
              <td>Role</td>
              <td>
                <select value={role} onChange={(e) => {handleChange(e, 'role')}}>
                  {roles.map((role) => {
                    return (
                      <option key={role} value={role}>{role}</option>                    
                    )
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Team</td>
              <td>
                  <input type="number" value={team} onChange={(e) => {handleChange(e, 'team')}}/>
              </td>
            </tr>
            <tr>
              <td>From</td>
              <td>
                  <input type="text" value={from} onChange={(e) => {handleChange(e, 'from')}}/>
              </td>
            </tr>
          </tbody>
        </table>
        {contentId === 0 ? 
          (<div className="buttons">
            <button onClick={() => {execPostPerson()}}>Submit</button>
          </div>
          ) : (
          <div className="buttons">
            <button onClick={() => {execEditPerson()}}>Modify</button>
            <button onClick={() => {execDeletePerson()}}>Delete</button>
            <button onClick={() => {setContentId(0)}}>New</button>
          </div>
          )}
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