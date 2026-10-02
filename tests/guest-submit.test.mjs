import test from 'node:test';
import assert from 'node:assert/strict';
import { submitGuestDates } from '../lib/guest-form.ts';

test('successful dates are separated from rejected and interrupted dates', async () => {
  const calls=[];
  const result=await submitGuestDates(['2026-10-06','2026-10-07','2026-10-08'],async date=>{
    calls.push(date);
    if(date==='2026-10-07')return {success:false,message:'Sudah ada rekod keberadaan yang bertindih untuk tarikh ini'};
    if(date==='2026-10-08')throw Error('network');
    return {success:true,displayName:'Guru Ujian',mode:'PLANNED'};
  });
  assert.deepEqual(calls,['2026-10-06','2026-10-07','2026-10-08']);
  assert.deepEqual(result.successful,['2026-10-06']);
  assert.deepEqual(result.failures.map(f=>f.date),['2026-10-07','2026-10-08']);
  assert.match(result.failures[0].message,/bertindih/);
  assert.equal(result.displayName,'Guru Ujian');
});

test('all-success batch includes every selected date', async()=>{
  const result=await submitGuestDates(['2026-10-06','2026-10-07'],async()=>({success:true,displayName:'Guru Ujian',mode:'LIVE'}));
  assert.equal(result.successful.length,2);assert.deepEqual(result.failures,[]);assert.equal(result.mode,'LIVE');
});
