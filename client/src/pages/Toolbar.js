import React, { useContext} from "react";
import { MdDeleteForever } from 'react-icons/md'
import { VscUnlock } from 'react-icons/vsc'
import { UserContext } from "./UserContext";
import { useNavigate } from 'react-router-dom'

const Toolbar = ( {...props} ) => {
    const [userTable, setUserTable] = useContext(UserContext)
    let navigate = useNavigate();

    const getCheckedUsersList = () => {
        const checkedUsers = [];
        userTable.forEach(item => {
            if(item.isChecked) checkedUsers.push(item._id)
        })
        return checkedUsers
    }

    async function updateAdminTable(event, type) {
        event.preventDefault();
        let users = getCheckedUsersList();
        const response = await fetch('http://localhost:1337/api/admin',{
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                users,
                type
            }),
        })
        const data = await response.json()
        if(data.status === 'ok'){ 
            console.log("ok")
            toggleBlock(type);
        }
        else{ 
            props.setUserName('')
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            navigate("/login")
        }
    }

    async function deleteFromAdminTable (event) {
        event.preventDefault();
        let users = getCheckedUsersList();
        const response = await fetch('http://localhost:1337/api/admin',{
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                users,
            }),
        })
        const data = await response.json()
        if(data.status === 'ok'){ 
            setUserTable(data.table.map(item => ({...item, "isChecked": false})))
        }
        else{
            props.setUserName('')
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            navigate("/login")
        }
    }

    const toggleBlock = (type) => {
        setUserTable(prev => prev.map(item => {
            if(item.isChecked){
                return ( type==='block' ?  
                {...item, isBlocked: true, isChecked: false} 
                : 
                {...item, isBlocked: false, isChecked: false})
            }
            return item
        }))
    }

    return (
        <div className="container-fluid d-flex justify-content-center gap-4 align-items-center mb-3">
            <div className="block__btn"><button className="btn btn-danger btn-lg" onClick={(event) => updateAdminTable(event, 'block')}>Block</button></div>
            <div style={{width: "50px", height: "50px"}}><VscUnlock className="w-100 h-100" onClick={(event) => updateAdminTable(event, 'unBlock')}/></div>
            <div style={{width: "50px", height: "50px"}}><MdDeleteForever className="w-100 h-100" onClick={(event) => deleteFromAdminTable(event)}/></div>
        </div>
    );
}

export default Toolbar