/** A small architectural plate: facilities accumulate instead of replacing the backyard.
 * @param {HTMLElement} host @param {import('../core/types.js').FacilityDefinition[]} facilities */
export function buildObservatory(host,facilities) {
  const plate=document.createElement('div'); plate.className='observatory-plate';
  plate.innerHTML=`<svg viewBox="0 0 520 155" aria-hidden="true" focusable="false">
    <path class="land-line" d="M10 135H510"/>
    <g data-building="backyard"><path d="m30 108 33-22 6 9-33 22zM48 111v24m0-22-16 22m16-22 17 22"/><circle cx="76" cy="62" r="2"/></g>
    <g data-building="permanent-enclosure"><path d="M103 135V100l28-20 28 20v35M97 100h68m-37 35v-24h15v24"/></g>
    <g data-building="robotic-dome"><path d="M196 135V99h65v36m-65-36a32.5 32.5 0 0 1 65 0m-34-32v32m-19 19h18m16 0h8"/></g>
    <g data-building="expanded-observatory"><path d="M292 135v-23a20 20 0 0 1 40 0v23m-40-23h40m11 23v-35a23 23 0 0 1 46 0v35m-46-35h46m-26-23v23"/></g>
    <g data-building="mountain-telescope"><path class="mountain-ridge" d="m384 135 31-42 12 13 34-74 49 103m-64-72 15-31 18 34"/><path d="M433 95V72h56v23m-56-23a28 28 0 0 1 56 0m-29-28v28M429 95h65"/></g>
  </svg><svg class="new-horizons" viewBox="0 0 520 100" aria-hidden="true" focusable="false">
    <path class="orbit-line" d="M10 79Q260 0 510 79"/>
    <g data-building="radio-observatory"><path d="M35 30q32 49 64 0m-64 0h64M67 54v34m-17 0h34m-17-34 23-40M86 9l8 9"/><circle cx="90" cy="14" r="2"/></g>
    <g data-building="orbital-commissioning"><path d="m228 42 24-8 9 26-24 8zM235 38l-19-13-11 9 25 15m25 3 27 13-10 12-21-19m-11-11 13-5m-9 12 12-4"/><circle cx="249" cy="47" r="5"/></g>
    <g data-building="infrared-commissioning"><path d="m416 58 31-17 31 17-31 16zM421 64l26 16 26-16m-47 7 21 15 21-15m-31-31v-8l10-6 10 6v12l-10 6zM447 26V14m-15 21 15 9 15-9"/></g>
  </svg>`;
  const caption=document.createElement('p'); caption.className='small facility-caption';
  const steps=document.createElement('ol'); steps.className='facility-steps'; steps.setAttribute('aria-label','Observatory facilities');
  for (const facility of facilities) {
    const step=document.createElement('li'); step.dataset.facility=facility.id??'backyard';
    const name=document.createElement('span'); name.textContent=facility.name;
    const status=document.createElement('small'); step.append(name,status); steps.append(step);
  }
  plate.append(caption,steps); host.append(plate);
}

/** @param {HTMLElement} host @param {{facilities:(import('../core/types.js').FacilityDefinition & {built:boolean})[],current:import('../core/types.js').FacilityDefinition}} observing */
export function renderObservatory(host,observing) {
  const caption=host.querySelector('.facility-caption');
  if (caption) caption.textContent=observing.current.description;
  for (const facility of observing.facilities) {
    const id=facility.id??'backyard';
    const building=host.querySelector(`[data-building="${id}"]`);
    building?.classList.toggle('is-built',facility.built);
    const step=host.querySelector(`[data-facility="${id}"]`);
    step?.classList.toggle('is-built',facility.built);
    const status=step?.querySelector('small');
    if (status) status.textContent=facility.built?'Built':'Planned';
    if (facility.id===observing.current.id) step?.setAttribute('aria-current','step');
    else step?.removeAttribute('aria-current');
  }
}
