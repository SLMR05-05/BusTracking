import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from '../views/Overview';
import Students from '../views/Students';
import Drivers from '../views/Drivers';
import Buses from '../views/Buses';
import Routes from '../views/Routes';
import Tracking from '../views/Tracking';
import Settings from '../views/Settings';

const viewMap = {
  overview: Overview,
  students: Students,
  drivers: Drivers,
  buses: Buses,
  routes: Routes,
  tracking: Tracking,
  settings: Settings,
};

export default function Dashboard() {
  const [active, setActive] = useState('overview');
  const ActiveView = viewMap[active] || Overview;

  return (
    <div className="flex">
      <Sidebar active={active} onSelect={setActive} />
      <main className="flex-1 p-10 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold capitalize">{active.replace('-', ' ')}</h1>
            <p className="text-slate-500">Quản lý xe buýt đưa đón học sinh - {active}</p>
          </header>

          <section>
            <ActiveView />
          </section>
        </div>
      </main>
    </div>
  );
}
