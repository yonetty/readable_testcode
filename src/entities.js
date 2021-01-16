class Sprint {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.stories = [];
    }

    addStory (story) {
        this.stories.push(story);
    }

    get assignment () {
        const perAsignee = this.stories.reduce((map, story) => {
            const key = story.asignee;
            if (map.has(key)) {
                map.set(key, map.get(key) + story.point);
            } else {
                map.set(key, story.point);
            }
            return map;
        }, new Map());
        return Array.from(perAsignee).sort((s1, s2) => s2[1] - s1[1]);
    }
}

class Story {
    constructor(title, description, point = 0, asignee) {
        this.title = title;
        this.description = description;
        this.point = point;
        this.asignee = asignee;
    }

    get canBeStarted () {
        return Boolean(this.asignee) && this.point > 0;
    }
}

module.exports.Sprint = Sprint;
module.exports.Story = Story;