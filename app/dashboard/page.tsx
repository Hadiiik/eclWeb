import React from 'react'
import MessagesTable from './dashboardCompenetnts/MessagesTable '
import NewUsersTable from './dashboardCompenetnts/NewUsersTable'
import RecentFilesTable from './dashboardCompenetnts/RecentFilesTable'
import DashBoardHeader from './dashboardCompenetnts/DashBoardHeader'

const DashBoard = () => {
  return (
    <>
    <DashBoardHeader/>
    <div className=' px-6  bg-slate-200'>
    <RecentFilesTable/>
    <NewUsersTable/>
    <MessagesTable/>
    </div>
    </>
  )
}

export default DashBoard
