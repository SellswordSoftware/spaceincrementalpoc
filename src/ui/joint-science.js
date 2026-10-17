/** @param {HTMLElement} host @param {import('../core/types.js').Definitions} definitions */
export function buildJointScience(host,definitions) {
  for (const program of definitions.jointPrograms) {
    const card=document.createElement('div'); card.className='mission-card'; card.dataset.jointProgram=program.id;
    const title=document.createElement('h3'); title.textContent=program.name;
    const contributors=document.createElement('p'); contributors.className='joint-contributors'; contributors.textContent=program.contributors.join(' + ');
    const description=document.createElement('p'); description.className='small'; description.textContent=program.description;
    const progress=document.createElement('progress'); progress.max=program.seconds; progress.setAttribute('aria-label',`${program.name} cycle progress`);
    const status=document.createElement('p'); status.className='course-info'; status.dataset.jointStatus=program.id;
    card.append(title,contributors,description,progress,status); host.append(card);
  }
  const finale=document.createElement('div'); finale.className='synthesis-card';
  finale.innerHTML='<p class="eyebrow">One connected view</p><h3>Final network synthesis</h3><p class="small" id="synthesis-requirements"></p><progress id="synthesis-progress" aria-label="Final synthesis progress"></progress><p class="course-info" id="synthesis-status"></p>';
  const receipt=document.createElement('div'); receipt.id='ending-receipt'; receipt.className='ending-receipt'; receipt.hidden=true; receipt.tabIndex=-1;
  receipt.setAttribute('role','region'); receipt.setAttribute('aria-labelledby','ending-title');
  receipt.innerHTML='<p class="eyebrow">Prototype complete</p><h2 id="ending-title">Eyes on the Universe</h2><p>From one backyard telescope to a connected view of the sky.</p><p class="small">Ground telescopes follow changing stars. Orbital measurements and stellar spectra place planetary systems in context. The mountain observatory and infrared flagship connect the network to light from early galaxies.</p><p class="small">Your network has completed its synthesis. Keep observing, or prestige to rebuild with Insight. Completion and all ordinary progress reset at prestige.</p><p class="small" id="ending-time"></p><button id="continue-observing">Keep observing</button>';
  finale.append(receipt); host.append(finale);
}
