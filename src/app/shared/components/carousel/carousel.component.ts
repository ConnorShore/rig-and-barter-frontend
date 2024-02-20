import { Component, Input, OnInit } from "@angular/core";
import { trigger, transition, useAnimation, style, animation, animate } from "@angular/animations";
import { MatIconModule } from "@angular/material/icon";

export const fadeIn = animation([
    style({ opacity: 0 }), // start state
    animate(
        "{{time}} cubic-bezier(0.785, 0.135, 0.15, 0.86)",
        style({ opacity: 1 })
    )
]);
  
export const fadeOut = animation([
    animate(
        "{{time}} cubic-bezier(0.785, 0.135, 0.15, 0.86)",
        style({ opacity: 0 })
    )
]);

@Component({
  selector: "rb-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
  standalone: true,
  imports: [
    MatIconModule
  ],
  animations: [
    trigger("slideAnimation", [
      transition("void => fade", [
        useAnimation(fadeIn, { params: { time: "500ms" } })
      ]),
      transition("fade => void", [
        useAnimation(fadeOut, { params: { time: "500ms" } })
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit {
  @Input() images: string[]; // image urls (move to base64 maybe)

  animationType = "fade";
  currentImage = 0;

  onPreviousClick() {
    const previous = this.currentImage - 1;
    this.currentImage = previous < 0 ? this.images.length - 1 : previous;
    console.log("previous clicked, new current slide is: ", this.currentImage);
  }

  onNextClick() {
    const next = this.currentImage + 1;
    this.currentImage = next === this.images.length ? 0 : next;
    console.log("next clicked, new current slide is: ", this.currentImage);
  }

  ngOnInit() {
    this.preloadImages(); // for the demo
  }

  preloadImages() {
    for (const image of this.images) {
      new Image().src = image;
    }
  }
}
