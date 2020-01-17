import Config from 'webpack-chain';

class A {
    say() {
        console.log('hello world');
    }
}

new A().say();

type Foo = {
    a?: {
        b?: {
            c?: 2;
        };
    };
};

const foo: Foo = {
    a: {}
};

console.log(foo?.a?.b?.c);

console.log(process.argv);

const config = new Config();

console.log(
    JSON.stringify(
        config
            .entry('main')
            .add('./src')
            .end()
            .toConfig(),
        null,
        2
    )
);
