// Basic Watch - 2021, 2022 JPP
// 2D modeling
// Basic animation
// Transformations

import * as THREE from "three";

export default class Watch extends THREE.Group {
  constructor(
    cityName,
    center = new THREE.Vector2(0.0, 0.0),
    radius = 0.75,
    nameBackgroundColor = 0xffffff,
    nameForegroundColor = 0x000000,
    dialColor = 0x000000,
    markersColor = 0xffffff,
    handsHMColor = 0xffffff,
    handSColor = 0xff0000
  ) {
    super();

    this.cities = [
      { name: "Oporto", timeZone: 0 },
      { name: "Paris", timeZone: 1 },
      { name: "Helsinki", timeZone: 2 },
      { name: "Beijing", timeZone: 7 },
      { name: "Tokyo", timeZone: 8 },
      { name: "Sydney", timeZone: 9 },
      { name: "Los Angeles", timeZone: -8 },
      { name: "New York", timeZone: -5 },
      { name: "Rio de Janeiro", timeZone: -4 },
      { name: "Reykjavik", timeZone: -1 },
    ];

    this.cityIndex = 0;
    const numberOfCities = this.cities.length;
    while (
      this.cityIndex < numberOfCities &&
      cityName != this.cities[this.cityIndex].name
    ) {
      this.cityIndex++;
    }
    if (this.cityIndex == numberOfCities) {
      this.cityIndex = 0;
    }

    // Create the watch (a dial, sixty markers, an hour hand, a minute hand and a second hand)

    /* TODO: #1 - Create the dial (a circle) with properties defined by the following parameters and constant:
            - radius: radius
            - segments: 60
            - color: dialColor

            - follow the instructions in this example to create the circle: https://threejs.org/docs/api/en/geometries/CircleGeometry.html */

    const segments = 60;

    let geometry = new THREE.CircleGeometry(radius, segments);
    let material = new THREE.MeshBasicMaterial({ color: dialColor });
    this.dial = new THREE.Mesh(geometry, material);
    this.add(this.dial);

    /* TODO: #2 - Create the sixty markers (sixty line segments) as follows:
            - start by considering three imaginary circles centered on the origin of the coordinate system, with radii defined by the following parameters: radius0, radius1 and radius2
            - each of the twelve main markers is a line segment connecting a point on the first circle to the corresponding point on the third
            - the remaining markers are line segments connecting points on the second circle to the equivalent points on the third
            - the segments color is defined by parameter markersColor
            - use a for () loop
            - use the parametric form of the circle equation to compute the points coordinates:
                x = r * cos(t) + x0
                y = r * sin(t) + y0

                where:
                - (x, y) are the point coordinates
                - (x0, y0) = (0.0, 0.0) are the center coordinates
                - r is the radius
                - t is a parametric variable in the range 0.0 <= t < 2.0 * π (pi)
            - don't forget that angles must be expressed in radians (180.0 degrees = π radians)
            - follow the instructions in this example to create the line segments: https://threejs.org/docs/api/en/objects/Line.html
            - note, however, that instead of making use of class Line you should use class LineSegments: https://threejs.org/docs/api/en/objects/LineSegments.html

        const radius0 = 0.85 * radius;
        const radius1 = 0.90 * radius;
        const radius2 = 0.95 * radius; */

    let points = [];

    const radiusInner = 0.85 * radius;
    const radiusMiddle = 0.9 * radius;
    const radiusOuter = 0.95 * radius;
    const angleIncrement = (2 * Math.PI) / segments;

    for (let i = 0; i < segments; i++) {
      let nextAngle = i * angleIncrement;

      // for outer points
      let xOuter = radiusOuter * Math.cos(nextAngle);
      let yOuter = radiusOuter * Math.sin(nextAngle);

      points.push(new THREE.Vector3(xOuter, yOuter, 0));

      // 12 hours in the clock, the clock has 60 minutes, so 60/12 = 5, so using mod of 5 should work
      if (i % 5 === 0) {
        // for inner points (hours)
        let xInner = radiusInner * Math.cos(nextAngle);
        let yInner = radiusInner * Math.sin(nextAngle);

        points.push(new THREE.Vector3(xInner, yInner, 0));
      } else {
        // for middle points (minutes)
        let xMiddle = radiusMiddle * Math.cos(nextAngle);
        let yMiddle = radiusMiddle * Math.sin(nextAngle);

        points.push(new THREE.Vector3(xMiddle, yMiddle, 0));
      }
    }

    geometry = new THREE.BufferGeometry().setFromPoints(points);
    material = new THREE.LineBasicMaterial({ color: markersColor });

    const markers = new THREE.LineSegments(geometry, material);
    this.add(markers);

    /* TODO: #3: Create the hour hand (a line segment) with length 0.5 * radius, pointing at 0.0 radians (the positive X-semiaxis) and color handsHMColor
        points = [...];
        geometry = new THREE.BufferGeometry()...;
        material = new THREE.LineBasicMaterial(...);
        this.handH = new THREE.LineSegments(...);
        this.add(this.handH); */

    this.handH = new THREE.Group();

    points = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.5 * radius, 0.0),
    ];

    geometry = new THREE.BufferGeometry().setFromPoints(points);
    material = new THREE.LineBasicMaterial({ color: handsHMColor });
    let handH = new THREE.LineSegments(geometry, material);
    this.handH.add(handH);
    this.add(this.handH);

    /* TODO: #4: Create the minute hand (a line segment) with length 0.7 * radius, pointing at 0.0 radians (the positive X-semiaxis) and color handsHMColor
        points = [...];
        geometry = new THREE.BufferGeometry()...;
        this.handM = new THREE.LineSegments(...);
        this.add(this.handM); */

    this.handM = new THREE.Group();

    points = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.7 * radius, 0.0),
    ];

    geometry = new THREE.BufferGeometry().setFromPoints(points);
    material = new THREE.LineBasicMaterial({ color: handsHMColor });
    let handM = new THREE.LineSegments(geometry, material);
    this.handM.add(handM);
    this.add(this.handM);

    // Create the second hand (a line segment and a circle) pointing at 0.0 radians (the positive X-semiaxis)
    this.handS = new THREE.Group();

    // Create the line segment
    points = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.8 * radius, 0.0),
    ];
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    material = new THREE.LineBasicMaterial({ color: handSColor });
    let handS = new THREE.LineSegments(geometry, material);
    this.handS.add(handS);

    // Create the circle
    geometry = new THREE.CircleGeometry(0.03 * radius, 16);
    material = new THREE.MeshBasicMaterial({ color: handSColor });
    handS = new THREE.Mesh(geometry, material);
    this.handS.add(handS);

    this.add(this.handS);

    // Set the watch position
    this.position.set(center.x, center.y);

    // Create one HTML <div> element

    // Start by getting a "container" <div> element with the top-left corner at the center of the viewport (the origin of the coordinate system)
    const container = document.getElementById("container");

    // Then create a "label" <div> element and append it as a child of "container"
    this.label = document.createElement("div");
    this.label.style.position = "absolute";
    this.label.style.left =
      (50.0 * center.x - 30.0 * radius).toString() + "vmin";
    this.label.style.top =
      (-50.0 * center.y + 54.0 * radius).toString() + "vmin";
    this.label.style.width = (60.0 * radius).toString() + "vmin";
    this.label.style.fontSize = (8.0 * radius).toString() + "vmin";
    this.label.style.backgroundColor =
      "#" + new THREE.Color(nameBackgroundColor).getHexString();
    this.label.style.color =
      "#" + new THREE.Color(nameForegroundColor).getHexString();
    this.label.innerHTML = this.cities[this.cityIndex].name;
    container.appendChild(this.label);
  }

  /**
   * responsible for regualarly computing the clock hands angles
   */
  update() {
    const time = Date().split(" ")[4].split(":").map(Number); // Hours: time[0]; minutes: time[1]; seconds: time[2]
    // console.log("🚀 ~ file: watch_template.js ~ line 214 ~ Watch ~ update ~ time", time)
    time[0] = (time[0] + this.cities[this.cityIndex].timeZone) % 12;
    // Compute the second hand angle
    let angle = Math.PI / 2.0 - (2.0 * Math.PI * time[2]) / 60.0;
    this.handS.rotation.z = angle;

    /* TODO: #5 - Compute the minute hand angle. It depends mostly on the current minutes value (time[1]), but you will get a more accurate result if you make it depend on the seconds value (time[2]) as well.
        angle = ...;
        this.handM.rotation.z = angle; */

    angle = Math.PI / 2.0 - (2.0 * Math.PI * time[1]) / 60.0;
    this.handM.rotation.z = angle;
    // angle = Math.PI / 2.0 - (2.0 * Math.PI * time[2] * 60) / 60.0;
    // this.handM.rotation.z = angle;

    /* TODO: #6 - Compute the hour hand angle. It depends mainly on the current hours value (time[0]). Nevertheless, you will get a much better result if you make it also depend on the minutes and seconds values (time[1] and time[2] respectively).
        angle = ...;
        this.handH.rotation.z = angle; */


        // divide by number of hours
    angle = Math.PI / 2.0 - (2.0 * Math.PI * time[0]) / 12.0;
    this.handH.rotation.z = angle;
  }
}
