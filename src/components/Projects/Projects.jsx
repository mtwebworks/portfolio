import React, { useEffect, useState, useRef } from 'react';
import { useIntersection } from 'react-use';
import gsap from 'gsap';

import Project from '../Project/Project';
import List from './List';

import './Projects.module.scss';

const Projects = () => {

  let thumbnailImage = useRef(null);
  const [offset, setOffset] = useState("");
  const [thumbnailImageState, setThumbnailImageState] = useState(null);
  const [mousePosition, setMousePosition] = useState({
    x: "",
    y: "",
  });

  const handleMouseMove = (e) => {
    const thumbnailOffset = document.querySelector('.projects__thumbnail-image').offsetLeft;

    setMousePosition({
      x: thumbnailOffset <= (window.innerWidth)
        ? thumbnailOffset + (e.movementX / 5.5) : thumbnailOffset - 1,
      y: e.clientY,
    })
  }

  const handleMouseLeave = () => {
    thumbnailImage.style.opacity = '0';
  }
  const handleMouseEnter = () => {
    setMousePosition({
      x: offset,
      y: "",
    })
    thumbnailImage.style.opacity = '1';
  }

  const section = useRef(null);
  const intersection = useIntersection(section, {
    root: null,
    rootMargin: "0px",
    threshold: .6
  })

  const slideAnimation = (element) => {
    gsap.to(element, 1, {
      opacity: 1,
      ease: 'power1.out',
      y: 0,
      stagger: {
        amount: 1
      },
      delay: .4
    })
  }

  intersection && intersection.intersectionRatio > .4 ? slideAnimation('.projects__animation-element') : null;

  const Projects = List.map(project => <Project key={project.id} {...project} thumbnailChange={setThumbnailImageState} animationClass={'projects__animation-element'} />)


  useEffect(() => {
    setOffset(thumbnailImage.offsetLeft);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [])

  return (
    <section ref={section} className='projects' id='projects'>
      <h2 className='projects__title projects__animation-element'>Projects</h2>
      <ul onMouseEnter={window.innerWidth > 768 ? handleMouseEnter : null} onMouseLeave={handleMouseLeave} className='projects__list'>
        <hr className='projects__hr projects__animation-element' />
        {Projects}
      </ul>
      <img ref={element => thumbnailImage = element} className='projects__thumbnail-image'
        style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
        src={thumbnailImageState} alt="" />
      <span className='projects__more-projects projects__animation-element'>More projects coming soon...</span>
    </section>
  );
}

export default Projects;